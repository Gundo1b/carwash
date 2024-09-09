// src/App.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTable } from 'react-table';
import { Container, Grid, TextField, Button, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl, Typography, Paper, Box } from '@mui/material';

function App() {
  const [date, setDate] = useState(new Date());
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carRegistration, setCarRegistration] = useState('');
  const [washed, setWashed] = useState(false);
  const [comment, setComment] = useState('');
  const [data, setData] = useState([]);

  const handleAdd = () => {
    const newData = {
      date: date.toDateString(),
      carBrand,
      carModel,
      carRegistration,
      washed: washed ? 'Washed' : 'Not Washed',
      comment,
    };
    setData([...data, newData]);
    // Reset form fields
    setDate(new Date());
    setCarBrand('');
    setCarModel('');
    setCarRegistration('');
    setWashed(false);
    setComment('');
  };
  

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Report</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('@media print {');
    printWindow.document.write('body { font-family: Arial, sans-serif; margin: 0; padding: 0; }');
    printWindow.document.write('.logo { position: absolute; top: 10px; left: 10px; width: 80px; height: auto; }'); // Adjust logo size
    printWindow.document.write('.content { margin-left: 100px; padding-top: 60px; }'); // Adjust margin-left
    printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }');
    printWindow.document.write('th { background-color: #f2f2f2; }');
    printWindow.document.write('h1, p { text-align: center; }');
    printWindow.document.write('}</style>');
    printWindow.document.write('</head><body>');

    // Add logo and title to the print page
    printWindow.document.write('<div class="logo">');
    printWindow.document.write('<img src="/logo.png" alt="Logo" style="width: 80px; height: auto;" />'); // Adjust logo size
    printWindow.document.write('</div>');
    printWindow.document.write('<div class="content">');
    printWindow.document.write('<h1>Car Wash Data</h1>');

    // Calculate the number of washed cars
    const numberOfWashedCars = data.filter(item => item.washed === 'Washed').length;
    printWindow.document.write('<div style="margin-bottom: 20px; font-size: 16px; text-align: center;">');
    printWindow.document.write(`<p><strong>Total Number of Washed Cars: ${numberOfWashedCars}</strong></p>`);
    printWindow.document.write(`<p><strong>Date: ${date.toDateString()}</strong></p>`); // Add selected date
    printWindow.document.write('</div>');

    // Generate a version of the table without the date column
    const tableHTML = document.createElement('table');
    tableHTML.style.width = '100%';
    tableHTML.style.borderCollapse = 'collapse';
    

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Car Brand', 'Car Make', 'Car Registration', 'Washed', 'Comment'].forEach(header => { // Updated header
      const th = document.createElement('th');
      th.style.borderBottom = '2px solid #ddd';
      th.style.padding = '8px';
      th.style.backgroundColor = '#f2f2f2';
      th.innerText = header;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    tableHTML.appendChild(thead);

    const tbody = document.createElement('tbody');
    document.querySelectorAll('tbody tr').forEach(row => {
      const newRow = document.createElement('tr');
      Array.from(row.children).forEach((cell, index) => {
        if (index > 0) { // Skip the date column
          const newCell = document.createElement('td');
          newCell.style.borderBottom = '1px solid #ddd';
          newCell.style.padding = '8px';
          newCell.innerHTML = cell.innerHTML;
          newRow.appendChild(newCell);
        }
      });
      tbody.appendChild(newRow);
    });
    tableHTML.appendChild(tbody);

    printWindow.document.write(tableHTML.outerHTML);
    printWindow.document.write('</div>'); // Close content div
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const columns = React.useMemo(
    () => [
      { Header: 'Date', accessor: 'date' },
      { Header: 'Car Brand', accessor: 'carBrand' },
      { Header: 'Car Make', accessor: 'carModel' }, // Updated this line
      { Header: 'Car Registration', accessor: 'carRegistration' },
      { Header: 'Washed', accessor: 'washed' },
      { Header: 'Comment', accessor: 'comment' },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mb={3}>
        <img src="/logo.png" alt="Logo" style={{ width: '100px', height: 'auto' }} />
        <Typography variant="h4" gutterBottom>Car Wash Manager</Typography>
      </Box>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <DatePicker selected={date} onChange={(date) => setDate(date)} customInput={<TextField label="Date" fullWidth />} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Car Brand</InputLabel>
              <Select value={carBrand} onChange={(e) => setCarBrand(e.target.value)}>
                <MenuItem value="Toyota">Toyota</MenuItem>
                <MenuItem value="BMW">BMW</MenuItem>
                <MenuItem value="Mercedes-Benz">Mercedes-Benz</MenuItem>
                <MenuItem value="Volkswagen">Volkswagen</MenuItem>
                <MenuItem value="Audi">Audi</MenuItem>
                <MenuItem value="Ford">Ford</MenuItem>
                <MenuItem value="Nissan">Nissan</MenuItem>
                <MenuItem value="Land Rover">Land Rover</MenuItem>
                <MenuItem value="Hyundai">Hyundai</MenuItem>
                <MenuItem value="Suzuki">Suzuki</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Car Make" variant="outlined" fullWidth value={carModel} onChange={(e) => setCarModel(e.target.value)} /> {/* Updated to Car Make */}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Car Registration" variant="outlined" fullWidth value={carRegistration} onChange={(e) => setCarRegistration(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={<Checkbox checked={washed} onChange={() => setWashed(!washed)} />}
              label="Washed"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Comment" variant="outlined" fullWidth value={comment} onChange={(e) => setComment(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleAdd}>Add to Data Grid</Button>
            <Button variant="contained" color="secondary" onClick={handlePrint} style={{ marginLeft: '10px' }}>Print Data Grid</Button>
          </Grid>
        </Grid>
      </Paper>
      <Box mt={3}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h6" gutterBottom>Data Table</Typography>
          <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()} style={{ borderBottom: '2px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()} style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Paper>
      </Box>
    </Container>
  );
}

export default App;
