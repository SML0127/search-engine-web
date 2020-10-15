# react-csv-uploader
This is react-csv-uploader by dropping and opening file loader

## Getting Started
```
npm install react-csv-uploader --save

import { CsvDropzone } from 'react-csv-uploader';
```

## Demo
https://cicada1992.github.io/react-csv-uploader/

Expected csv file shape for demo
| A | B | C | D | E
|:---|:---|:---:|:---:|:---:|
|id-1 | name-1 | A | 10 | 1
|id-2 | name-2 | B | 3 | 2

## Props
| Property | Type | Required? | Description |
|:---|:---|:---:|:---|
| onFileLoad | (data: any[]) => void | ✓ | Inject callback function to do something after file uploaded
| onUploaderOpen | () => void |  | If you want to handle after opening uploader, use this.


## Example
```
<CsvDropzone onFileLoad={this.handleFileLoad}>
  {({ openUploader }) => <FakeTable data={data} openUploader={openUploader} />}
</CsvDropzone>

private handleFileLoad(data: any[]) {
  console.log(data); <- try this line and confirm data!
  ...To handle data to your taste after file loaded.
}
```