import autobind from 'autobind-decorator';
import Papa, { ParseResult } from 'papaparse';
import React from 'react';
import Dropzone from 'react-dropzone';

export interface CsvDropzoneProps {
  onFileLoad: (data: any[]) => void;
  onUploaderOpen?: () => void;
  children: (args: { openUploader: () => void }) => React.ReactNode;
}

class CsvDropzone extends React.Component<CsvDropzoneProps> {
  private fileReader: FileReader;
  private dropzoneRef: Dropzone;

  constructor(props: CsvDropzoneProps) {
    super(props);

    this.fileReader = new FileReader();
    this.fileReader.onload = this.handleFileLoad;
  }

  public render() {
    const { children } = this.props;
    return (
      <Dropzone
        ref={this.handleDropzoneRef}
        accept="text/csv"
        disableClick
        onDrop={this.handleDrop}
        style={{ width: '100%', height: '100%' }}
      >
        {children({ openUploader: this.handleUploadClick })}
      </Dropzone>
    );
  }

  @autobind
  private handleDropzoneRef(ref: Dropzone) {
    this.dropzoneRef = ref;
  }

  @autobind
  private handleDrop(acceptedFiles: any, rejectedFiles: any) {
    const csv = acceptedFiles[0] || rejectedFiles[0];
    this.fileReader.readAsText(csv);
  }

  @autobind
  private async handleFileLoad() {
    const { onFileLoad } = this.props;
    const csvList = this.fileReader.result as string;
    const { data }: ParseResult = Papa.parse(csvList, { skipEmptyLines: true });
    onFileLoad(data);
  }

  @autobind
  private handleUploadClick() {
    const { onUploaderOpen } = this.props;
    this.dropzoneRef.open();
    if (onUploaderOpen) {
      onUploaderOpen();
    }
  }
}

export default CsvDropzone;
