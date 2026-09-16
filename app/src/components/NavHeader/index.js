'use client';

import { Box, IconButton } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { useRouter } from "next/navigation";
import { ArrowBack } from "@mui/icons-material";

export default function NavHeader() {
      const router = useRouter();

    const bg = blueGrey['100'];
    return (
        <Box className="navHeader" bgcolor={bg} padding="8px" marginBottom="10px">
            <div className=".arrow-back-action-container">
            <IconButton onClick={() => router.back()}>
                <ArrowBack/>
            </IconButton>
            </div>
        </Box>        
    );
}