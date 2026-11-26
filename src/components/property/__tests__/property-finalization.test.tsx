import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PropertyFinalizationModal } from "@/components/property/property-finalization-modal";
import { PropertyDetail } from "@/types/property";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";

vi.mock("@/lib/api-client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("@/stores/auth-store", () => ({
  useAuthStore: vi.fn(),
}));

const mockProperty: PropertyDetail = {
  id: "prop-baner-123",
  title: "Luxury 2BHK in Baner",
  address: "Baner Road, Pune",
  locality: "Baner",
  rentAmount: 25000,
  monthlyRent: 25000,
  depositAmount: 50000,
  securityDeposit: 50000,
  bhk: "2 BHK",
  furnishingStatus: "Semi Furnished",
};

describe("PropertyFinalizationModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    (useAuthStore as any).mockReturnValue({
      user: {
        id: "user-tenant-1",
        fullName: "Rahul Sharma",
        email: "rahul@example.com",
        phoneNumber: "+919876543210",
      },
      isAuthenticated: true,
      openAuthModal: vi.fn(),
    });
  });

  afterEach(() => {
    sessionStorage.clear();
    delete (window as any).Razorpay;
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <PropertyFinalizationModal
        isOpen={false}
        onClose={vi.fn()}
        property={mockProperty}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders active pass when property is already finalized", async () => {
    (apiClient.get as any).mockResolvedValueOnce({
      data: {
        propertyId: "prop-baner-123",
        status: "COMPLETED",
        dealId: "deal-uuid-456",
        orderId: "ORD-KEYRA-FEE-12345",
        amount: 9999,
      },
    });

    render(
      <PropertyFinalizationModal
        isOpen={true}
        onClose={vi.fn()}
        property={mockProperty}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Property Finalization Confirmed")).toBeInTheDocument();
    });

    expect(screen.getByText("Deal Closure Pass Active")).toBeInTheDocument();
    expect(screen.getByText("deal-uuid-456")).toBeInTheDocument();
    expect(screen.getByText("ORD-KEYRA-FEE-12345")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Done & Return to Property/i })).toBeInTheDocument();

    // Verify initiate is NOT called when already finalized
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it("renders finalization modal with two-phase initiation and server-calculated wallet discount breakdown", async () => {
    (apiClient.get as any).mockResolvedValueOnce({
      data: {
        propertyId: "prop-baner-123",
        status: "NOT_PURCHASED",
      },
    });

    (apiClient.post as any).mockResolvedValueOnce({
      data: {
        orderId: "order_rzp_12345",
        amountInPaise: 899900,
        currency: "INR",
        keyId: "rzp_test_key",
        originalFee: 9999,
        walletDiscount: 1000,
        gatewayPayable: 8999,
        remainingWalletBalance: 500,
        isWalletOnly: false,
      },
    });

    render(
      <PropertyFinalizationModal
        isOpen={true}
        onClose={vi.fn()}
        property={mockProperty}
      />
    );

    // Verify status check then initiation
    await waitFor(() => {
      expect(screen.getByText("Finalize Property")).toBeInTheDocument();
    });

    expect(apiClient.post).toHaveBeenCalledWith(
      "/tenant/properties/prop-baner-123/finalize/initiate",
      { useWallet: true, walletOnly: false }
    );

    // Property overview
    expect(screen.getByText("Luxury 2BHK in Baner")).toBeInTheDocument();
    expect(screen.getByText("KEYRA Service & Deal Closure Fee")).toBeInTheDocument();

    // Authoritative fee breakdown
    expect(screen.getByText("₹9,999")).toBeInTheDocument();
    expect(screen.getByText("- ₹1,000")).toBeInTheDocument();
    expect(screen.getByText("₹1,000 applied to this deal")).toBeInTheDocument();
    expect(screen.getByText("₹8,999")).toBeInTheDocument();

    // Deliverables
    expect(screen.getByText(/Professional Rent Negotiation/i)).toBeInTheDocument();
    expect(screen.getByText(/Direct Key Handover & Move-In Inspection/i)).toBeInTheDocument();
    expect(screen.getByText(/Single-Point Issue Resolution/i)).toBeInTheDocument();
    expect(screen.getByText(/100% Verified Owners/i)).toBeInTheDocument();

    // CTA button reflects authoritative gateway payable amount
    expect(screen.getByRole("button", { name: /Proceed to Pay ₹8,999/i })).toBeInTheDocument();
  });

  it("completes two-phase gateway payment flow with Razorpay callback and cryptographic verification", async () => {
    let razorpayOptions: any = null;
    (window as any).Razorpay = function (this: any, options: any) {
      razorpayOptions = options;
      this.open = vi.fn(() => {
        options.handler({
          razorpay_order_id: "order_rzp_12345",
          razorpay_payment_id: "pay_test_789",
          razorpay_signature: "sig_valid_hash_abc",
        });
      });
      this.on = vi.fn();
    };

    (apiClient.get as any).mockResolvedValueOnce({
      data: {
        propertyId: "prop-baner-123",
        status: "NOT_PURCHASED",
      },
    });

    (apiClient.post as any)
      // Phase 1: Initiate
      .mockResolvedValueOnce({
        data: {
          orderId: "order_rzp_12345",
          amountInPaise: 899900,
          currency: "INR",
          keyId: "rzp_test_key_123",
          originalFee: 9999,
          walletDiscount: 1000,
          gatewayPayable: 8999,
          remainingWalletBalance: 500,
          isWalletOnly: false,
        },
      })
      // Phase 2: Verify
      .mockResolvedValueOnce({
        data: {
          propertyId: "prop-baner-123",
          status: "COMPLETED",
          dealId: "deal-finalized-999",
          orderId: "order_rzp_12345",
          amount: 8999,
        },
      });

    const onSuccess = vi.fn();

    render(
      <PropertyFinalizationModal
        isOpen={true}
        onClose={vi.fn()}
        property={mockProperty}
        onSuccess={onSuccess}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Proceed to Pay ₹8,999/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Proceed to Pay ₹8,999/i }));

    await waitFor(() => {
      expect(razorpayOptions).not.toBeNull();
      expect(razorpayOptions.key).toBe("rzp_test_key_123");
      expect(razorpayOptions.order_id).toBe("order_rzp_12345");
      expect(razorpayOptions.amount).toBe(899900);

      // Verify POST /finalize/verify call
      expect(apiClient.post).toHaveBeenCalledWith(
        "/tenant/properties/prop-baner-123/finalize/verify",
        {
          orderId: "order_rzp_12345",
          paymentId: "pay_test_789",
          signature: "sig_valid_hash_abc",
          walletOnly: false,
        }
      );
      expect(onSuccess).toHaveBeenCalled();
      expect(screen.getByText("Property Finalization Confirmed")).toBeInTheDocument();
      expect(screen.getByText("deal-finalized-999")).toBeInTheDocument();
    });
  });

  it("handles wallet-only settlement without invoking Razorpay SDK", async () => {
    const razorpayMock = vi.fn();
    (window as any).Razorpay = razorpayMock;

    (apiClient.get as any).mockResolvedValueOnce({
      data: {
        propertyId: "prop-baner-123",
        status: "NOT_PURCHASED",
      },
    });

    (apiClient.post as any)
      // Initiate returns 100% wallet settlement
      .mockResolvedValueOnce({
        data: {
          orderId: "ORD-WALLET-999",
          amountInPaise: 0,
          currency: "INR",
          keyId: "rzp_test_key",
          originalFee: 9999,
          walletDiscount: 9999,
          gatewayPayable: 0,
          remainingWalletBalance: 2000,
          isWalletOnly: true,
        },
      })
      // Verify returns COMPLETED
      .mockResolvedValueOnce({
        data: {
          propertyId: "prop-baner-123",
          status: "COMPLETED",
          dealId: "deal-wallet-100",
          orderId: "ORD-WALLET-999",
          amount: 0,
        },
      });

    render(
      <PropertyFinalizationModal
        isOpen={true}
        onClose={vi.fn()}
        property={mockProperty}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/100% Settled via KEYRA Wallet/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Finalize with Wallet Cash \(₹0 Payable\)/i })
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Finalize with Wallet Cash \(₹0 Payable\)/i })
    );

    await waitFor(() => {
      // Must NOT invoke Razorpay SDK
      expect(razorpayMock).not.toHaveBeenCalled();

      // Must call verify with walletOnly: true
      expect(apiClient.post).toHaveBeenCalledWith(
        "/tenant/properties/prop-baner-123/finalize/verify",
        {
          orderId: "ORD-WALLET-999",
          walletOnly: true,
        }
      );
      expect(screen.getByText("Property Finalization Confirmed")).toBeInTheDocument();
    });
  });

  it("eliminates insecure fallback: gateway failure shows error and retry, never calls direct /finalize", async () => {
    // Razorpay constructor throws or is missing
    (window as any).Razorpay = function () {
      throw new Error("Razorpay script network failure");
    };

    (apiClient.get as any).mockResolvedValueOnce({
      data: {
        propertyId: "prop-baner-123",
        status: "NOT_PURCHASED",
      },
    });

    (apiClient.post as any).mockResolvedValueOnce({
      data: {
        orderId: "order_rzp_fail_test",
        amountInPaise: 899900,
        currency: "INR",
        keyId: "rzp_test_key",
        originalFee: 9999,
        walletDiscount: 1000,
        gatewayPayable: 8999,
        remainingWalletBalance: 500,
        isWalletOnly: false,
      },
    });

    render(
      <PropertyFinalizationModal
        isOpen={true}
        onClose={vi.fn()}
        property={mockProperty}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Proceed to Pay ₹8,999/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Proceed to Pay ₹8,999/i }));

    await waitFor(() => {
      expect(screen.getByText(/Razorpay script network failure/i)).toBeInTheDocument();
    });

    // CRITICAL: Ensure old insecure POST /finalize was NEVER called!
    expect(apiClient.post).not.toHaveBeenCalledWith("/tenant/properties/prop-baner-123/finalize");
    expect(apiClient.post).toHaveBeenCalledTimes(1); // Only the initial /finalize/initiate
    expect(screen.queryByText("Property Finalization Confirmed")).not.toBeInTheDocument();
  });

  it("allows recovery of unverified payment from sessionStorage without re-opening Razorpay", async () => {
    const savedPayload = {
      orderId: "order_rzp_lost_net",
      paymentId: "pay_lost_123",
      signature: "sig_lost_456",
      walletOnly: false,
    };
    sessionStorage.setItem("keyra_pending_finalization_prop-baner-123", JSON.stringify(savedPayload));

    (apiClient.get as any).mockResolvedValueOnce({
      data: {
        propertyId: "prop-baner-123",
        status: "NOT_PURCHASED",
      },
    });

    (apiClient.post as any)
      // Initial initiate calculation
      .mockResolvedValueOnce({
        data: {
          orderId: "order_rzp_lost_net",
          amountInPaise: 899900,
          currency: "INR",
          keyId: "rzp_test_key",
          originalFee: 9999,
          walletDiscount: 1000,
          gatewayPayable: 8999,
          remainingWalletBalance: 500,
          isWalletOnly: false,
        },
      })
      // Verification recovery response
      .mockResolvedValueOnce({
        data: {
          propertyId: "prop-baner-123",
          status: "COMPLETED",
          dealId: "deal-recovered-777",
          orderId: "order_rzp_lost_net",
          amount: 8999,
        },
      });

    render(
      <PropertyFinalizationModal
        isOpen={true}
        onClose={vi.fn()}
        property={mockProperty}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Unconfirmed payment detected. Click to re-verify without re-paying./i)).toBeInTheDocument();
    });

    const verifyBtn = screen.getByRole("button", { name: /Verify Now/i });
    fireEvent.click(verifyBtn);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        "/tenant/properties/prop-baner-123/finalize/verify",
        savedPayload
      );
      expect(screen.getByText("Property Finalization Confirmed")).toBeInTheDocument();
      expect(screen.getByText("deal-recovered-777")).toBeInTheDocument();
      // Storage should be cleared upon successful verification
      expect(sessionStorage.getItem("keyra_pending_finalization_prop-baner-123")).toBeNull();
    });
  });

  it("releases reserved wallet funds by calling cancel when modal is closed with pending order", async () => {
    (apiClient.get as any).mockResolvedValueOnce({
      data: {
        propertyId: "prop-baner-123",
        status: "NOT_PURCHASED",
      },
    });

    (apiClient.post as any).mockResolvedValueOnce({
      data: {
        orderId: "order_rzp_pending_to_cancel",
        amountInPaise: 899900,
        currency: "INR",
        keyId: "rzp_test_key",
        originalFee: 9999,
        walletDiscount: 1000,
        gatewayPayable: 8999,
        remainingWalletBalance: 500,
        isWalletOnly: false,
      },
    });

    const onClose = vi.fn();

    render(
      <PropertyFinalizationModal
        isOpen={true}
        onClose={onClose}
        property={mockProperty}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Finalize Property")).toBeInTheDocument();
    });

    const closeBtn = screen.getByRole("button", { name: /Close/i });
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        "/tenant/properties/prop-baner-123/finalize/cancel?orderId=order_rzp_pending_to_cancel"
      );
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("toggles wallet preference and re-initiates checkout calculation", async () => {
    (apiClient.get as any).mockResolvedValueOnce({
      data: {
        propertyId: "prop-baner-123",
        status: "NOT_PURCHASED",
      },
    });

    (apiClient.post as any)
      // Initial initiate with useWallet: true
      .mockResolvedValueOnce({
        data: {
          orderId: "order_rzp_with_wallet",
          amountInPaise: 899900,
          currency: "INR",
          keyId: "rzp_test_key",
          originalFee: 9999,
          walletDiscount: 1000,
          gatewayPayable: 8999,
          remainingWalletBalance: 500,
          isWalletOnly: false,
        },
      })
      // Subsequent initiate with useWallet: false
      .mockResolvedValueOnce({
        data: {
          orderId: "order_rzp_no_wallet",
          amountInPaise: 999900,
          currency: "INR",
          keyId: "rzp_test_key",
          originalFee: 9999,
          walletDiscount: 0,
          gatewayPayable: 9999,
          remainingWalletBalance: 1500,
          isWalletOnly: false,
        },
      });

    render(
      <PropertyFinalizationModal
        isOpen={true}
        onClose={vi.fn()}
        property={mockProperty}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Proceed to Pay ₹8,999/i })).toBeInTheDocument();
    });

    const toggle = screen.getByRole("checkbox", { name: /Use KEYRA Wallet Cash/i });
    expect(toggle).toBeChecked();

    fireEvent.click(toggle);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        "/tenant/properties/prop-baner-123/finalize/initiate",
        { useWallet: false, walletOnly: false }
      );
      expect(screen.getByRole("button", { name: /Proceed to Pay ₹9,999/i })).toBeInTheDocument();
    });
  });

  it("gracefully falls back to direct finalization when backend returns 404 on initiate (legacy Cloud Run compatibility)", async () => {
    (window as any).Razorpay = function (this: any, options: any) {
      this.open = vi.fn(() => {
        options.handler({
          razorpay_order_id: "order_rzp_12345",
          razorpay_payment_id: "pay_test_789",
          razorpay_signature: "sig_valid_hash_abc",
        });
      });
      this.on = vi.fn();
    };

    (apiClient.get as any).mockResolvedValueOnce({
      data: { status: "UNPAID" },
    });
    // /finalize/initiate returns 404
    (apiClient.post as any).mockRejectedValueOnce({
      response: { status: 404, data: { message: "Resource not found: api/v1/tenant/properties/prop-baner-123/finalize/initiate" } },
    });
    // fallback direct /finalize succeeds
    (apiClient.post as any).mockResolvedValueOnce({
      data: {
        paymentId: "pay-legacy-123",
        dealId: "deal-legacy-123",
        propertyId: "prop-baner-123",
        tenantId: "tenant-user-123",
        orderId: "ORD-KEYRA-DIRECT",
        status: "COMPLETED",
        createdAt: "2026-11-25T12:00:00Z",
      },
    });

    render(
      <PropertyFinalizationModal
        isOpen={true}
        onClose={vi.fn()}
        property={mockProperty}
      />
    );

    // Modal renders ₹9,999 without red error banner
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Proceed to Pay ₹9,999/i })).toBeInTheDocument();
      expect(screen.queryByText(/Resource not found/i)).not.toBeInTheDocument();
    });

    const payBtn = screen.getByRole("button", { name: /Proceed to Pay ₹9,999/i });
    fireEvent.click(payBtn);

    // Calls direct /finalize
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        "/tenant/properties/prop-baner-123/finalize"
      );
      expect(screen.getByText(/Property Finalization Confirmed/i)).toBeInTheDocument();
      expect(screen.getByText("deal-legacy-123")).toBeInTheDocument();
    });
  });
});
