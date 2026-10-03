import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Card,
  CardContent,
  Chip
} from "@mui/material";
import { ExpandMore, Phone, Email, LocationOn, Send, LocalHospital } from "@mui/icons-material";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      toast.warning("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success("Thank you! Your message has been received. Our team will contact you shortly.");
      setFormData({ fullName: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  const faqs = [
    {
      q: "How does MediQueue token booking work?",
      a: "Patients select their target hospital and OPD department online, generating a unique token number. You can monitor live queue position from your phone and arrive right when your number is called."
    },
    {
      q: "Is MediQueue free for patients?",
      a: "Yes! OPD token registration and live queue tracking on MediQueue is completely free for patients. You only pay standard hospital consultation fees at the counter."
    },
    {
      q: "How can a hospital integrate with MediQueue?",
      a: "Super Administrators onboard partner hospitals and assign Hospital Admins. Hospital Admins can then create staff accounts for doctors to manage queues from their OPD room screens."
    },
    {
      q: "Can I cancel my token if I cannot make it?",
      a: "Yes, you can cancel your active token anytime under the 'My Tokens' section in your patient dashboard."
    }
  ];

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      <Navbar />

      {/* Header Banner */}
      <Box
        sx={{
          py: 7,
          background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
          color: "#FFFFFF",
          textAlign: "center"
        }}
      >
        <Container maxWidth="md">
          <Chip label="24/7 SUPPORT & INQUIRIES" color="primary" sx={{ fontWeight: 800, mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
            Get in Touch With MediQueue
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 600, mx: "auto" }}>
            Have questions about token booking, hospital onboarding, or technical support? Our healthcare support team is available 24/7.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={6}>
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 4, bgcolor: "#FFFFFF" }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                Send Us a Message
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Fill out the inquiry form below and our hospital support team will get back to you within 2 hours.
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Subject / Topic"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Hospital Partnership, OPD Token Query"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Your Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<Send />}
                  disabled={loading}
                  sx={{ mt: 3, py: 1.4, px: 4, fontWeight: 800 }}
                >
                  {loading ? "Sending Message..." : "Submit Inquiry"}
                </Button>
              </form>
            </Paper>
          </Grid>

          {/* Contact Details & Info */}
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              <Card sx={{ borderRadius: 4, borderLeft: "4px solid #0D9488" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        bgcolor: "primary.light",
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Phone />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Toll-Free Helpline
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        +91 1800-MEDIQUEUE
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 4, borderLeft: "4px solid #6366F1" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        bgcolor: "secondary.light",
                        color: "secondary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Email />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email Support
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        support@mediqueue.com
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 4, borderLeft: "4px solid #10B981" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        bgcolor: "success.light",
                        color: "success.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <LocationOn />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Headquarters
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        MediQueue Tech Park, Hitech City, Hyderabad
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        {/* FAQs */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, textAlign: "center" }}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 4 }}>
            Got questions? We have quick answers for patients and hospital admins.
          </Typography>

          <Box sx={{ maxWidth: 900, mx: "auto" }}>
            {faqs.map((faq, idx) => (
              <Accordion key={idx} sx={{ mb: 2, borderRadius: "12px !important", border: "1px solid #E2E8F0" }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}

export default Contact;
