'use client';
import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { styled } from '@mui/material/styles';
import { CloudUpload } from "@mui/icons-material";
import styles from './UploadProfileImage.module.css';
import { deepOrange } from "@mui/material/colors";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

export default function UploadProfileImage({ inputName, actionImageSrc, alt }) {
    const [image, setImage] = useState("/assets/default-not-set-profile.svg");

    function onUploaded(event) {
        const file = event.target.files[0];
        if (file) {
          const imageUrl = URL.createObjectURL(file);
          setImage(imageUrl);
        }
    }

    return (
        <Box display="inline-block" className={styles.uploadProfileImage}>
            <center>
                <img className={styles.img} src={image} alt={alt} />
                <IconButton component="label" className={styles.uploadAction} variant="contained" color="secondary">
                    <CloudUpload fontSize="large" />
                    <VisuallyHiddenInput
                        type="file"
                        onChange={onUploaded} name="logoEstabelecimento"/>
                </IconButton>
            </center>
        </Box>
    );
}
