import { Box, Typography, LinearProgress } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";

export const getPasswordCriteria = (password = "") => {
  return [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter (a-z)", met: /[a-z]/.test(password) },
    { label: "One number (0-9)", met: /[0-9]/.test(password) },
    { label: "One special character (!@#$%^&* etc.)", met: /[!@#$%^&*(),.?":{}|<>\-_=+]/.test(password) }
  ];
};

export const isPasswordStrong = (password = "") => {
  if (!password) return false;
  const criteria = getPasswordCriteria(password);
  return criteria.every((c) => c.met);
};

export default function PasswordStrengthIndicator({ password = "" }) {
  if (!password) return null;

  const criteria = getPasswordCriteria(password);
  const metCount = criteria.filter((c) => c.met).length;
  const strengthPercentage = (metCount / criteria.length) * 100;

  let strengthLabel = "Weak";
  let strengthColor = "#EF4444"; // Red
  if (metCount >= 5) {
    strengthLabel = "Strong";
    strengthColor = "#10B981"; // Green
  } else if (metCount >= 3) {
    strengthLabel = "Moderate";
    strengthColor = "#F59E0B"; // Orange
  }

  return (
    <Box
      sx={{
        mt: 1.5,
        p: 2,
        bgcolor: "#F8FAFC",
        borderRadius: 2.5,
        border: "1px solid #E2E8F0"
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569" }}>
          Password Strength:{" "}
          <span style={{ color: strengthColor, fontWeight: 800 }}>{strengthLabel}</span>
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 700, color: strengthColor }}>
          {metCount} of {criteria.length} Met
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={strengthPercentage}
        sx={{
          height: 6,
          borderRadius: 3,
          bgcolor: "#E2E8F0",
          "& .MuiLinearProgress-bar": {
            bgcolor: strengthColor,
            borderRadius: 3
          },
          mb: 1.5
        }}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 0.8
        }}
      >
        {criteria.map((item, idx) => (
          <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            {item.met ? (
              <CheckCircle sx={{ fontSize: 16, color: "#10B981" }} />
            ) : (
              <Cancel sx={{ fontSize: 16, color: "#CBD5E1" }} />
            )}
            <Typography
              variant="caption"
              sx={{
                fontWeight: item.met ? 700 : 500,
                color: item.met ? "#0F766E" : "#64748B",
                fontSize: "0.75rem"
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
