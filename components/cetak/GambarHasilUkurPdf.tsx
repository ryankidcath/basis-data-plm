/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

// 1 mm = 2.834645669 pt (72/25.4)
const MM_TO_PT = 72 / 25.4;

function mmToPt(mm: number): number {
  return mm * MM_TO_PT;
}

interface GambarHasilUkurPdfProps {
  mainImageBase64: string;
  mainImageWidthMm: number;
  mainImageHeightMm: number;
  fieldImageBase64: string | null;
  fieldImageWidthMm: number;
  fieldImageHeightMm: number;
}

const styles = StyleSheet.create({
  page: {
    width: mmToPt(420),
    height: mmToPt(297),
    padding: 0,
  },
});

export function GambarHasilUkurPdf({
  mainImageBase64,
  mainImageWidthMm,
  mainImageHeightMm,
  fieldImageBase64,
  fieldImageWidthMm,
  fieldImageHeightMm,
}: GambarHasilUkurPdfProps) {
  const titleCenterX = mmToPt(315);
  const titleCenterY = mmToPt(20);
  const arrowCenterX = mmToPt(375);
  const arrowTopY = mmToPt(20);
  const mainImageCenterX = mmToPt(315);
  const mainImageCenterY = mmToPt(75);
  const fieldImageCenterX = mmToPt(315);
  const fieldImageCenterY = mmToPt(223);

  const mainImageWidthPt = mmToPt(mainImageWidthMm);
  const mainImageHeightPt = mmToPt(mainImageHeightMm);
  const fieldImageWidthPt = mmToPt(fieldImageWidthMm);
  const fieldImageHeightPt = mmToPt(fieldImageHeightMm);

  return (
    <Document>
      <Page size="A3" orientation="landscape" style={styles.page}>
        {/* Judul: titik tengah (315, 20) */}
        <View
          style={{
            position: "absolute",
            left: titleCenterX - 40,
            top: titleCenterY - 6,
            width: 80,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Helvetica-Bold",
              borderBottomWidth: 1,
              paddingBottom: 2,
            }}
          >
            Gambar Hasil Ukur
          </Text>
        </View>

        {/* Panah utara: apex (375, 20) + Skala di bawah */}
        <View
          style={{
            position: "absolute",
            left: arrowCenterX - 7,
            top: arrowTopY,
            width: 14,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 7,
              borderRightWidth: 7,
              borderBottomWidth: 9,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: "black",
            }}
          />
          <Text style={{ fontSize: 8, marginTop: 4 }}>Skala 1:250</Text>
        </View>

        {/* Gambar utama: titik tengah (315, 75) */}
        <Image
          src={`data:image/png;base64,${mainImageBase64}`}
          style={{
            position: "absolute",
            left: mainImageCenterX - mainImageWidthPt / 2,
            top: mainImageCenterY - mainImageHeightPt / 2,
            width: mainImageWidthPt,
            height: mainImageHeightPt,
          }}
        />

        {/* Gambar bidang: titik tengah (315, 223) */}
        {fieldImageBase64 && (
          <Image
            src={`data:image/png;base64,${fieldImageBase64}`}
            style={{
              position: "absolute",
              left: fieldImageCenterX - fieldImageWidthPt / 2,
              top: fieldImageCenterY - fieldImageHeightPt / 2,
              width: fieldImageWidthPt,
              height: fieldImageHeightPt,
            }}
          />
        )}
      </Page>
    </Document>
  );
}
