import { StyleSheet } from "@react-pdf/renderer"

const colors = {
  primary: "#1e40af",
  textDark: "#111827",
  textMuted: "#6b7280",
  borderGray: "#e5e7eb",
  backgroundLight: "#f9fafb",
  white: "#ffffff",
}

export const pdfStyles = StyleSheet.create({
  // Page
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: colors.textDark,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 48,
    height: 48,
    objectFit: "contain",
  },
  workspaceName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
  },
  workspaceInfo: {
    fontSize: 8,
    color: colors.textMuted,
    marginTop: 2,
  },

  // Quote info
  quoteInfoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quoteNumberBox: {
    backgroundColor: colors.primary,
    color: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  quoteNumberText: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: colors.white,
  },
  quoteDetails: {
    alignItems: "flex-end",
  },
  quoteDetailRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 2,
  },
  labelText: {
    fontSize: 8,
    color: colors.textMuted,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  valueText: {
    fontSize: 10,
    color: colors.textDark,
  },

  // Customer info
  customerSection: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: colors.backgroundLight,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    marginBottom: 8,
  },
  customerRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  customerLabel: {
    fontSize: 8,
    color: colors.textMuted,
    width: 60,
    fontFamily: "Helvetica-Bold",
  },
  customerValue: {
    fontSize: 10,
    color: colors.textDark,
  },

  // Items table
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.white,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
    paddingVertical: 6,
    paddingHorizontal: 8,
    minHeight: 24,
    alignItems: "center",
  },
  tableRowEven: {
    backgroundColor: colors.backgroundLight,
  },
  tableCellItem: {
    width: "28%",
    fontSize: 10,
  },
  tableCellDescription: {
    width: "22%",
    fontSize: 8,
    color: colors.textMuted,
  },
  tableCellQty: {
    width: "8%",
    fontSize: 10,
    textAlign: "center",
  },
  tableCellUnit: {
    width: "10%",
    fontSize: 10,
    textAlign: "center",
  },
  tableCellUnitPrice: {
    width: "16%",
    fontSize: 10,
    textAlign: "right",
  },
  tableCellTotal: {
    width: "16%",
    fontSize: 10,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
  },

  // Totals
  totalsSection: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  totalsBox: {
    width: 220,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },
  totalLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  totalValue: {
    fontSize: 10,
    color: colors.textDark,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
  },
  grandTotalValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
  },

  // Notes
  notesSection: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: colors.backgroundLight,
    borderRadius: 4,
  },
  notesTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: colors.textDark,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 9,
    color: colors.textMuted,
    lineHeight: 1.5,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
    paddingTop: 8,
  },
  footerTerms: {
    fontSize: 7,
    color: colors.textMuted,
    lineHeight: 1.4,
    marginBottom: 4,
  },
  footerBrand: {
    fontSize: 7,
    color: colors.textMuted,
    textAlign: "right",
  },
})
