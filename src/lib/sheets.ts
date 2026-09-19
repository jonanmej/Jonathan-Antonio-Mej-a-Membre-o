export const createSheetWithPivot = async (accessToken: string, detailedData: any[]) => {
  // 1. Create a new Spreadsheet
  const dateStr = new Date().toISOString().split('T')[0];
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: `Reporte_Asistencia_${dateStr}`,
      },
      sheets: [
        {
          properties: {
            title: 'Registros Detallados',
            sheetId: 0,
          },
        },
        {
          properties: {
            title: 'Resumen Nómina (Dinámica)',
            sheetId: 1,
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    throw new Error('Failed to create spreadsheet');
  }

  const spreadsheet = await createRes.json();
  const spreadsheetId = spreadsheet.spreadsheetId;

  // 2. Prepare detailed data for insertion
  // Header
  const values = [
    ['Empleado', 'Cargo', 'Hora Entrada', 'Hora Salida', 'Horas Totales', 'Horas Extras', 'Estado', 'Comentarios'],
  ];

  detailedData.forEach(record => {
    values.push([
      record.user,
      record.role,
      record.horaEntrada,
      record.horaSalida,
      record.horasTotales,
      record.horasExtras,
      record.status,
      record.comment,
    ]);
  });

  // 3. Write data to 'Registros Detallados'
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Registros Detallados!A1:H${values.length}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: values,
    }),
  });

  // 4. Create the Pivot Table via batchUpdate
  const batchUpdateRequest = {
    requests: [
      {
        updateCells: {
          rows: [
            {
              values: [
                {
                  pivotTable: {
                    source: {
                      sheetId: 0,
                      startRowIndex: 0,
                      endRowIndex: values.length,
                      startColumnIndex: 0,
                      endColumnIndex: 8,
                    },
                    rows: [
                      {
                        sourceColumnOffset: 0, // Empleado
                        showTotals: true,
                        sortOrder: 'ASCENDING',
                      },
                      {
                        sourceColumnOffset: 1, // Cargo
                        showTotals: false,
                        sortOrder: 'ASCENDING',
                      },
                    ],
                    values: [
                      {
                        summarizeFunction: 'COUNTA',
                        sourceColumnOffset: 0, // Empleado (Turnos)
                        name: 'Total Turnos'
                      },
                      {
                        summarizeFunction: 'SUM',
                        sourceColumnOffset: 4, // Horas Totales
                        name: 'Suma Horas Totales'
                      },
                      {
                        summarizeFunction: 'SUM',
                        sourceColumnOffset: 5, // Horas Extras
                        name: 'Suma Horas Extras'
                      },
                    ],
                    valueLayout: 'HORIZONTAL',
                  },
                },
              ],
            },
          ],
          start: {
            sheetId: 1,
            rowIndex: 0,
            columnIndex: 0,
          },
          fields: 'pivotTable',
        },
      },
    ],
  };

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(batchUpdateRequest),
  });

  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
};
