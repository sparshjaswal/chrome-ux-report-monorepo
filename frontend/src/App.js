import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";

const App = () => {
  const [urls, setUrls] = useState("");
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");

  const fetchChromeUXReport = async (url) => {
    try {
      const response = await axios.post("http://localhost:5000/api/report", {
        url,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching Chrome UX Report:", error);
      return null;
    }
  };

  const handleSearch = async () => {
    const urlList = urls.split(",").map((url) => url.trim());
    const results = await Promise.all(urlList.map(fetchChromeUXReport));
    setData(results.filter((result) => result !== null));
  };

  const filteredData = filter
    ? data.filter((report) => report.metrics[filter])
    : data;

  const sortedData = sort
    ? [...filteredData].sort((a, b) => a.metrics[sort] - b.metrics[sort])
    : filteredData;

  return (
    <Container>
      <TextField
        label="Enter URLs (comma separated)"
        variant="outlined"
        fullWidth
        margin="normal"
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>

      <FormControl fullWidth margin="normal">
        <InputLabel>Filter by Metric</InputLabel>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <MenuItem value="">None</MenuItem>
          {/* Add more metrics as needed */}
          <MenuItem value="firstContentfulPaint">
            First Contentful Paint
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Sort by Metric</InputLabel>
        <Select value={sort} onChange={(e) => setSort(e.target.value)}>
          <MenuItem value="">None</MenuItem>
          {/* Add more metrics as needed */}
          <MenuItem value="firstContentfulPaint">
            First Contentful Paint
          </MenuItem>
        </Select>
      </FormControl>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>URL</TableCell>
              <TableCell>Metric</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((report, index) => (
              <React.Fragment key={index}>
                <TableRow>
                  <TableCell rowSpan={Object.keys(report.metrics).length}>
                    {report.url}
                  </TableCell>
                  {Object.keys(report.metrics).map((metric, idx) => (
                    <React.Fragment key={metric}>
                      {idx > 0 && <TableRow></TableRow>}
                      <TableCell>{metric}</TableCell>
                      <TableCell>{report.metrics[metric]}</TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default App;
