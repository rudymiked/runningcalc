// PaceList.tsx
import { decimalPaceToString, removeLeadingZerosAndColons } from "../utils/utils";
import type { IPaceData } from "../utils/generatePaces";
import { Typography } from "@mui/material";

export const PaceList = ({ paces }: { paces: IPaceData | undefined }) => (
  <>
    <Typography variant="h6" gutterBottom>
      Paces (min/mile):
    </Typography>
    {paces && Object.keys(paces).length > 0 ? (
      <ul>
        {Object.entries(paces).map(([paceType, paceValue]) => (
          <li key={paceType} style={{ listStyleType: "none", textAlign: "justify" }}>
            <b>{paceType}</b>: {decimalPaceToString(paceValue.pace)} ({removeLeadingZerosAndColons(paceValue.time)})
          </li>
        ))}
      </ul>
    ) : (
      <Typography>No paces generated yet.</Typography>
    )}
  </>
);