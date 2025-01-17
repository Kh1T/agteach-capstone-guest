import {
  Button,
  List,
  ListItem,
  Stack,
  Typography,
  Link,
  Divider,
  Alert,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const DiseaseInfoComponent = ({ data }) => {
  const { cure, disease, problem, symptom } = data;

  const [t] = useTranslation("global");

  return (
    <Stack width="100%" gap={3}>
      <Typography variant="h3">{disease}</Typography>
      <Stack gap={3}>
        <InformationDetail
          title={t("agai.problem")}
          desc={problem}
          icon={<WarningIcon color="error" fontSize="large" />}
        />
        <InformationDetail
          title={t("agai.symptom")}
          desc={symptom}
          icon={<SearchOutlinedIcon color="blue" fontSize="large" />}
        />
        <InformationDetail
          title={t("agai.cure")}
          desc={cure}
          icon={<FavoriteBorderOutlinedIcon color="teal" fontSize="large" />}
        />
      </Stack>
      <Divider />
      <Alert icon={<BloodtypeIcon />} severity="success">
        <Stack gap={1}>
          <Typography>{t("agai.areYouInerestedIn", { disease })}</Typography>
          <Link
            component={RouterLink}
            to="https://alphabeez.anbschool.org/courses/912"
            target="_blank"
            underline="none"
          >
            <Button
              variant="contained"
              color="secondary"
              endIcon={<OndemandVideoIcon />}
            >
              {t("agai.learnMore")}
            </Button>
          </Link>
        </Stack>
      </Alert>
    </Stack>
  );
};

const InformationDetail = ({ title, desc, icon }) => {
  return (
    <Stack>
      <Stack direction="row" alignItems="center" gap={2}>
        {icon}
        <Typography variant="h4">{title}</Typography>
      </Stack>
      <List sx={{ listStyleType: "disc", listStylePosition: "inside" }}>
        <ListItem sx={{ display: "list-item", paddingY: 1 }}>{desc}</ListItem>
      </List>
    </Stack>
  );
};
