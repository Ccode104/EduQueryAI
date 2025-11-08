import DocumentUploadZone from '../DocumentUploadZone';

export default function DocumentUploadZoneExample() {
  return (
    <DocumentUploadZone
      onFilesSelected={(files) => console.log('Files selected:', files)}
    />
  );
}
