/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { FaChevronLeft } from "react-icons/fa6";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/navigation";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const THeader = ({ heading, routes = "" }) => {
  const router = useRouter();

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Item>
                <div className="d-flex">
                  <div className="name">
                    {routes == "" ? (
                      <a onClick={() => router.back()}>
                        <FaChevronLeft />
                      </a>
                    ) : (
                      <a onClick={() => router.push(`${routes}`)}>
                        <FaChevronLeft />
                      </a>
                    )}
                    <h1 className="title">{heading}</h1>
                  </div>
                </div>
              </Item>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default THeader;
