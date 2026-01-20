import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (theme: Theme) => StyleSheet.create({
  scrollContent: {
    paddingBottom: theme.spacing[6],
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border.primary,
  },
  orText: {
    color: theme.colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    padding: theme.spacing[3],
    gap: theme.spacing[3],
  },
  card: {
    marginBottom: theme.spacing[3],
    padding: theme.spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
    gap: theme.spacing[2],
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionIconText: {
    fontSize: 18,
  },
  shieldIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldIconText: {
    fontSize: 16,
  },
  sectionTitle: {
    flex: 1,
    color: theme.colors.text.primary,
  },
  trustBadge: {
    backgroundColor: theme.colors.success[100],
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full,
  },
  trustBadgeText: {
    color: theme.colors.success[700],
  },
  formGroup: {
    marginBottom: theme.spacing[4],
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[1],
  },
  label: {
    color: theme.colors.text.primary,
  },
  optionalLabel: {
    color: theme.colors.text.tertiary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[3],
    fontSize: 16,
    backgroundColor: theme.colors.surface.primary,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.regular,
  },
  helperText: {
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing[1],
  },
  dropdownInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[3],
    backgroundColor: theme.colors.surface.primary,
  },
  dropdownText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.regular,
  },
  dropdownPlaceholder: {
    color: theme.colors.text.tertiary,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.surface.primary,
    paddingHorizontal: theme.spacing[3],
  },
  searchIcon: {
    marginRight: theme.spacing[2],
  },
  searchInput: {
    flex: 1,
    padding: theme.spacing[3],
    fontSize: 16,
    color: theme.colors.text.primary,
    fontFamily: theme.fontFamily.regular,
  },
  uploadContainer: {
    borderWidth: 2,
    borderColor: theme.colors.border.primary,
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.secondary,
    marginBottom: theme.spacing[3],
  },
  uploadContainerDisabled: {
    opacity: 0.6,
  },
  uploadIconContainer: {
    marginBottom: theme.spacing[2],
  },
  uploadIcon: {
    fontSize: 32,
  },
  uploadText: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  uploadSubtext: {
    color: theme.colors.text.tertiary,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.primary[50],
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing[2],
  },
  infoIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    color: theme.colors.primary[900],
    lineHeight: 18,
  },
  button: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingVertical: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing[2],
    marginTop: theme.spacing[4],
    marginBottom: theme.spacing[6],
  },
  buttonText: {
    color: theme.colors.text.inverse,
  },
  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  lockIcon: {
    fontSize: 14,
  },
  securityText: {
    color: theme.colors.text.tertiary,
    letterSpacing: 0.5,
  },
  // Uploaded file styles
  uploadedFileContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[3],
    backgroundColor: theme.colors.surface.primary,
    marginBottom: theme.spacing[3],
  },
  uploadedFileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[2],
  },
  filePreviewImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.secondary,
  },
  filePreviewPdf: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  pdfLabel: {
    color: theme.colors.primary.DEFAULT,
    fontWeight: '600',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  fileSize: {
    color: theme.colors.text.tertiary,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.error[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    color: theme.colors.error.DEFAULT,
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Preview modal styles
  previewModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewModalContent: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: theme.colors.surface.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing[2],
    right: theme.spacing[2],
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: theme.colors.text.inverse,
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 400,
    borderRadius: theme.borderRadius.md,
  },
  previewPdfContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[6],
    gap: theme.spacing[3],
  },
  previewPdfTitle: {
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  previewPdfText: {
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  previewPdfSize: {
    color: theme.colors.text.tertiary,
    textAlign: 'center',
  },
  // BottomSheet styles
  bottomSheetTitle: {
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[4],
  },
  bottomSheetListContent: {
    paddingBottom: theme.spacing[4],
    flexGrow: 1,
  },
  stateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  stateItemSelected: {
    backgroundColor: theme.colors.primary[50],
  },
  stateItemText: {
    color: theme.colors.text.primary,
    flex: 1,
  },
  stateItemTextSelected: {
    color: theme.colors.primary.DEFAULT,
    fontWeight: '600',
  },
});

