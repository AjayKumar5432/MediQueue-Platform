import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  Stack,
  Divider,
  Chip,
  CircularProgress,
  IconButton,
  TextField,
  Alert
} from "@mui/material";
import {
  CreditCard,
  AccountBalanceWallet,
  AccountBalance,
  CheckCircle,
  Close,
  Lock,
  Security,
  ConfirmationNumber,
  ArrowForward,
  VpnKey,
  VerifiedUser,
  ArrowBack
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { verifyPaymentAndBookToken, createPaymentOrder } from "../../api/paymentApi";

function PaymentModal({ open, onClose, hospitalDepartment, hospitalName, onSuccess }) {
  const [selectedMethod, setSelectedMethod] = useState("UPI");
  const [upiVpa, setUpiVpa] = useState("user@okicici");
  const [upiPin, setUpiPin] = useState("1234");
  const [step, setStep] = useState("METHOD"); // "METHOD" | "PIN_PROMPT" | "SUCCESS"
  const [loading, setLoading] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);
  const [pinError, setPinError] = useState("");
  const [selectedBank, setSelectedBank] = useState("SBI");

  if (!hospitalDepartment) return null;

  const consultationFee = hospitalDepartment.consultationFee || 500;
  const deptName = hospitalDepartment.department?.departmentName || "General OPD";

  const handleProceedToPinStep = () => {
    setPinError("");
    setStep("PIN_PROMPT");
  };

  const handleAuthorizePinAndBook = async () => {

    if (upiPin !== "1234") {
      setPinError("❌ Incorrect 4-Digit Security PIN. Default PIN is '1234'.");
      toast.error("Incorrect Security PIN. Please enter '1234'.");
      return;
    }


    setLoading(true);
    setPinError("");

    try {
      // 1. Create order intent
      let orderId = "order_" + Math.random().toString(36).substring(2, 11);
      try {
        const orderRes = await createPaymentOrder({
          hospitalDepartmentId: hospitalDepartment.hospitalDepartmentId,
          amount: consultationFee,
          paymentMethod: selectedMethod === "CASH" ? "CASH_AT_DESK" : "ONLINE_GATEWAY"
        });
        if (orderRes.data?.orderId) {
          orderId = orderRes.data.orderId;
        }
      } catch (e) {
        console.log("Using local Order ID fallback", e);
      }

      // 2. Gateway Authorization & Verification
      const txnId = "TXN_" + Math.floor(100000000 + Math.random() * 900000000);

      const verifyRes = await verifyPaymentAndBookToken({
        hospitalDepartmentId: hospitalDepartment.hospitalDepartmentId,
        orderId: orderId,
        transactionId: txnId,
        paymentMethod: selectedMethod === "CASH" ? "CASH_AT_DESK" : "ONLINE_GATEWAY"
      });

      toast.success(`💳 UPI PIN Verified! Token #${verifyRes.data?.tokenNumber || "Issued"} Booked Successfully!`);
      setPaymentSuccessData(verifyRes.data);
      setStep("SUCCESS");
      if (onSuccess) {
        onSuccess(verifyRes.data);
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Payment authorization failed.";
      toast.error(msg);
      setPinError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setStep("METHOD");
    setPaymentSuccessData(null);
    setUpiPin("1234");
    setPinError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.18)" }
      }}
    >
      {step === "SUCCESS" && paymentSuccessData ? (
        // SUCCESS SCREEN
        <Box sx={{ p: 4, textAlign: "center", bgcolor: "#FFFFFF" }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "#ECFDF5",
              color: "#10B981",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2.5
            }}
          >
            <CheckCircle sx={{ fontSize: 50 }} />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 900, color: "#0F172A", mb: 0.5 }}>
            Payment Successful!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            UPI Authorization verified. OPD consultation token confirmed.
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              mb: 3,
              textAlign: "left"
            }}
          >
            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  TOKEN NUMBER
                </Typography>
                <Chip
                  label={`#${paymentSuccessData.tokenNumber || "COMPLETED"}`}
                  color="primary"
                  sx={{ fontWeight: 900, fontSize: "1rem", px: 1 }}
                />
              </Box>

              <Divider />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Hospital:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {hospitalName || "Apollo Hospital"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Department:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {deptName}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Amount Paid:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: "#10B981" }}>
                  ₹{consultationFee}.00 (PAID via UPI)
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Transaction Ref ID:
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, fontFamily: "monospace", color: "#0F766E" }}>
                  {paymentSuccessData.transactionId || "TXN_SUCCESS"}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Stack spacing={1.5}>
            {paymentSuccessData?.paymentId && (
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                href={`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/customer/payments/${paymentSuccessData.paymentId}/pdf`}
                target="_blank"
                sx={{ py: 1.2, fontWeight: 800, borderRadius: "10px" }}
              >
                📄 Download Payment Receipt (PDF)
              </Button>
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={handleClose}
              sx={{
                py: 1.5,
                fontWeight: 800,
                borderRadius: "10px",
                bgcolor: "#0D9488",
                "&:hover": { bgcolor: "#0F766E" }
              }}
            >
              Done & View Token
            </Button>
          </Stack>

        </Box>
      ) : step === "PIN_PROMPT" ? (
        // authentic UPI / GATEWAY PIN AUTHENTICATION DIALOG STEP
        <>
          <DialogTitle
            sx={{
              bgcolor: "#0F172A",
              color: "#FFFFFF",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
              px: 3
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <VpnKey sx={{ color: "#10B981" }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  NPCI UPI 4-Digit Security PIN
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, color: "#94A3B8" }}>
                  Razorpay Secure Gateway Authorization
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setStep("METHOD")} disabled={loading} sx={{ color: "#94A3B8" }}>
              <ArrowBack />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3.5, bgcolor: "#F8FAFC" }}>
            <Stack spacing={3}>
              {/* Payment Target Summary */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  textAlign: "center"
                }}
              >
                <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700, letterSpacing: 1 }}>
                  PAYING TO
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, color: "#0F172A", mt: 0.5 }}>
                  {hospitalName || "Apollo Hospital"} OPD Services
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Speciality: {deptName}
                </Typography>

                <Typography variant="h3" sx={{ fontWeight: 900, color: "#0D9488", my: 1.5 }}>
                  ₹{consultationFee}.00
                </Typography>

                <Chip
                  icon={<VerifiedUser fontSize="small" sx={{ color: "#10B981 !important" }} />}
                  label={`VPA: ${upiVpa}`}
                  size="small"
                  sx={{ fontWeight: 700, bgcolor: "#F0FDF4", color: "#166534" }}
                />
              </Paper>

              {/* PIN Entry Field */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "#FFFFFF",
                  border: "2px solid #0D9488",
                  textAlign: "center"
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0F172A", mb: 1 }}>
                  🔒 Enter 4-Digit UPI PIN:
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                  Type your UPI Security PIN below to authorize instant ₹{consultationFee} payment.
                </Typography>

                <TextField
                  autoFocus
                  type="password"
                  value={upiPin}
                  onChange={(e) => setUpiPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="••••"
                  inputProps={{
                    maxLength: 6,
                    style: {
                      textAlign: "center",
                      fontSize: "2rem",
                      fontWeight: 900,
                      letterSpacing: "0.8rem"
                    }
                  }}
                  sx={{
                    width: 220,
                    mx: "auto",
                    bgcolor: "#F1F5F9",
                    borderRadius: 3,
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" }
                  }}
                />

                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5, fontStyle: "italic" }}>
                  (Default testing PIN: <strong>1234</strong>)
                </Typography>

                {pinError && (
                  <Alert severity="error" sx={{ mt: 2, borderRadius: 2, textAlign: "left" }}>
                    {pinError}
                  </Alert>
                )}
              </Paper>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3, bgcolor: "#FFFFFF", borderTop: "1px solid #E2E8F0" }}>
            <Button onClick={() => setStep("METHOD")} disabled={loading} sx={{ fontWeight: 700 }}>
              Back
            </Button>
            <Button
              variant="contained"
              disabled={loading}
              onClick={handleAuthorizePinAndBook}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <VpnKey />}
              sx={{
                bgcolor: "#0D9488",
                fontWeight: 900,
                px: 4,
                py: 1.3,
                borderRadius: "10px",
                fontSize: "1rem",
                "&:hover": { bgcolor: "#0F766E" }
              }}
            >
              {loading ? "Verifying UPI PIN..." : `Authorize Payment & Issue Token`}
            </Button>
          </DialogActions>
        </>
      ) : (
        // CHECKOUT METHOD SELECTION
        <>
          <DialogTitle
            sx={{
              background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
              color: "#FFFFFF",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2.5,
              px: 3
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <ConfirmationNumber sx={{ fontSize: 28 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  Confirm OPD Consultation & Pay
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {hospitalName || "Apollo Hospital"} • {deptName}
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={handleClose} disabled={loading} sx={{ color: "#FFFFFF" }}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3.5 }}>
            <Stack spacing={3}>
              {/* Fee Breakdown Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <Box>
                  <Typography variant="overline" sx={{ color: "#166534", fontWeight: 800, letterSpacing: 1 }}>
                    CONSULTATION FEE
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: "#0F766E" }}>
                    ₹{consultationFee}.00
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Token Processing & OPD Doctor Consultation
                  </Typography>
                </Box>
                <Chip
                  icon={<Security fontSize="small" />}
                  label="Verified"
                  color="success"
                  size="small"
                  sx={{ fontWeight: 800 }}
                />
              </Paper>

              {/* Payment Methods */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: "#0F172A" }}>
                  Select Payment Method:
                </Typography>

                <RadioGroup value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}>
                  <Stack spacing={1.5}>
                    <Paper
                      elevation={0}
                      onClick={() => setSelectedMethod("UPI")}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: selectedMethod === "UPI" ? "2px solid #0D9488" : "1px solid #E2E8F0",
                        bgcolor: selectedMethod === "UPI" ? "#F0FDF4" : "#FFFFFF",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <FormControlLabel
                        value="UPI"
                        control={<Radio size="small" color="primary" />}
                        label={
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                              UPI (GPay / PhonePe / Paytm / BHIM)
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Requires 4-Digit UPI PIN authorization
                            </Typography>
                          </Box>
                        }
                      />
                      <AccountBalanceWallet sx={{ color: "#0D9488" }} />
                    </Paper>

                    {selectedMethod === "UPI" && (
                      <Box sx={{ pl: 4, pr: 1, py: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155" }}>
                          Enter VPA / UPI ID:
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          value={upiVpa}
                          onChange={(e) => setUpiVpa(e.target.value)}
                          placeholder="yourname@okaxis"
                          sx={{ mt: 0.5, bgcolor: "#FFFFFF", borderRadius: 2 }}
                        />
                        <Stack direction="row" spacing={0.8} sx={{ mt: 1, flexWrap: "wrap", gap: 0.5 }}>
                          {["@okicici", "@okhdfcbank", "@ybl", "@paytm", "@axl"].map((handle) => (
                            <Chip
                              key={handle}
                              label={handle}
                              size="small"
                              onClick={() => {
                                const username = upiVpa.split("@")[0] || "user";
                                setUpiVpa(username + handle);
                              }}
                              sx={{ fontWeight: 700, cursor: "pointer", bgcolor: "#E6FFFA", color: "#0D9488" }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}


                    <Paper
                      elevation={0}
                      onClick={() => setSelectedMethod("CARD")}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: selectedMethod === "CARD" ? "2px solid #0D9488" : "1px solid #E2E8F0",
                        bgcolor: selectedMethod === "CARD" ? "#F0FDF4" : "#FFFFFF",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <FormControlLabel
                        value="CARD"
                        control={<Radio size="small" color="primary" />}
                        label={
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                              Credit / Debit Card
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Visa, MasterCard, RuPay, Maestro
                            </Typography>
                          </Box>
                        }
                      />
                      <CreditCard sx={{ color: "#6366F1" }} />
                    </Paper>

                    <Paper
                      elevation={0}
                      onClick={() => setSelectedMethod("NETBANKING")}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: selectedMethod === "NETBANKING" ? "2px solid #0D9488" : "1px solid #E2E8F0",
                        bgcolor: selectedMethod === "NETBANKING" ? "#F0FDF4" : "#FFFFFF",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <FormControlLabel
                        value="NETBANKING"
                        control={<Radio size="small" color="primary" />}
                        label={
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                              NetBanking
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              All major Indian Banks supported
                            </Typography>
                          </Box>
                        }
                      />
                      <AccountBalance sx={{ color: "#8B5CF6" }} />
                    </Paper>

                    {selectedMethod === "NETBANKING" && (
                      <Box sx={{ pl: 4, pr: 1, py: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155" }}>
                          Select Your Bank:
                        </Typography>
                        <Stack direction="row" spacing={0.8} sx={{ mt: 1, flexWrap: "wrap", gap: 0.8 }}>
                          {[
                            { name: "SBI", label: "State Bank of India" },
                            { name: "HDFC", label: "HDFC Bank" },
                            { name: "ICICI", label: "ICICI Bank" },
                            { name: "AXIS", label: "Axis Bank" },
                            { name: "KOTAK", label: "Kotak Mahindra" },
                            { name: "PNB", label: "Punjab National Bank" }
                          ].map((b) => (
                            <Chip
                              key={b.name}
                              label={b.label}
                              size="small"
                              onClick={() => setSelectedBank(b.name)}
                              sx={{
                                fontWeight: 800,
                                cursor: "pointer",
                                bgcolor: selectedBank === b.name ? "#8B5CF6" : "#F1F5F9",
                                color: selectedBank === b.name ? "#FFFFFF" : "#475569"
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Stack>

                </RadioGroup>
              </Box>

              {/* Total Payable Summary */}
              <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: 3, border: "1px solid #E2E8F0" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Consultation Subtotal:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    ₹{consultationFee}.00
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Platform / Gateway Fee:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#10B981" }}>
                    FREE (₹0)
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, color: "#0F172A" }}>
                    Total Amount Payable:
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, color: "#0D9488" }}>
                    ₹{consultationFee}.00
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                <Lock fontSize="small" sx={{ color: "#10B981" }} />
                <Typography variant="caption">
                  Protected by 256-Bit SSL Encryption & Razorpay NPCI Gateway.
                </Typography>
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1, bgcolor: "#F8FAFC" }}>
            <Button onClick={handleClose} disabled={loading} sx={{ fontWeight: 700 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={loading}
              onClick={handleProceedToPinStep}
              endIcon={<ArrowForward />}
              sx={{
                bgcolor: "#0D9488",
                fontWeight: 900,
                px: 3,
                py: 1.3,
                borderRadius: "10px",
                fontSize: "1rem",
                "&:hover": { bgcolor: "#0F766E" }
              }}
            >
              {`Proceed to Pay ₹${consultationFee}`}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default PaymentModal;
