import PptxGenJS from 'pptxgenjs';

const KPMG_BLUE = '00338D';
const KPMG_LIGHT = 'E8EEF7';
const WHITE = 'FFFFFF';
const DARK_TEXT = '1E293B';
const GREY_TEXT = '64748B';

function addHeaderSlide(prs, joinerName, joiningDate) {
  const slide = prs.addSlide();
  slide.background = { color: KPMG_BLUE };

  // KPMG Title
  slide.addText('KPMG', {
    x: 0.5, y: 0.4, w: 9, h: 0.6,
    fontSize: 24, bold: true, color: WHITE, fontFace: 'Arial',
  });

  // Large purple/blue rectangle
  slide.addShape(prs.ShapeType.rect, {
    x: 0.8, y: 1.2, w: 6.5, h: 4.0, fill: { color: '6236FF' },
  });

  // Main Title inside rectangle
  slide.addText('CREATE – Training &\nCompetency\nFramework', {
    x: 1.1, y: 1.2, w: 6.0, h: 2.5,
    fontSize: 66, bold: true, color: WHITE, fontFace: 'KPMG Bold', align: 'left',
  });

  // Name and Date inside rectangle (bottom)
  slide.addText(`${joinerName}\nStart date: ${joiningDate}`, {
    x: 1.1, y: 4.2, w: 6.0, h: 0.8,
    fontSize: 18, color: WHITE, fontFace: 'Calibri', align: 'left',
  });
}

function addGatewaySectionSlide(prs, gatewayTitle, deadline, index) {
  const slide = prs.addSlide();
  slide.background = { color: KPMG_BLUE };

  // Light blue rectangle on the left
  slide.addShape(prs.ShapeType.rect, {
    x: 0.8, y: 1.2, w: 6.5, h: 5.0, fill: { color: '88D7E1' },
  });

  const numStr = index < 10 ? `0${index}` : `${index}`;
  
  slide.addText(numStr, {
    x: 1.1, y: 1.6, w: 3, h: 1.0,
    fontSize: 80, bold: true, color: KPMG_BLUE, fontFace: 'KPMG Bold', align: 'left',
  });

  slide.addText(gatewayTitle, {
    x: 1.1, y: 3.0, w: 7.0, h: 1.5,
    fontSize: 80, bold: true, color: KPMG_BLUE, fontFace: 'KPMG Bold', align: 'left',
  });

  if (deadline) {
    slide.addText(deadline, {
      x: 1.1, y: 5.3, w: 4, h: 0.5,
      fontSize: 18, bold: true, color: KPMG_BLUE, fontFace: 'Calibri', align: 'left',
    });
  }
}

function addChecklistSlide(prs, gatewayTitle, tasks, checklistData, sectionLabel = 'Checklist') {
  const slide = prs.addSlide();

  // Header bar
  slide.addShape(prs.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 1.0, fill: { color: KPMG_BLUE },
  });
  slide.addText(`${gatewayTitle} – ${sectionLabel}`, {
    x: 0.3, y: 0.1, w: 9.4, h: 0.8,
    fontSize: 44, bold: true, color: WHITE, fontFace: 'KPMG Bold',
  });

  // Table rows
  const tableRows = [
    [
      { text: 'Task', options: { bold: true, color: WHITE, fill: { color: KPMG_BLUE }, fontSize: 11, fontFace: 'Calibri' } },
      { text: 'Completion Date', options: { bold: true, color: WHITE, fill: { color: KPMG_BLUE }, fontSize: 11, fontFace: 'Calibri' } },
      { text: 'Notes', options: { bold: true, color: WHITE, fill: { color: KPMG_BLUE }, fontSize: 11, fontFace: 'Calibri' } },
    ],
  ];

  tasks.forEach((task, i) => {
    const data = checklistData?.[task.id] || {};
    const rowFill = i % 2 === 0 ? WHITE : KPMG_LIGHT;
    tableRows.push([
      { text: task.task, options: { color: DARK_TEXT, fill: { color: rowFill }, fontSize: 10, fontFace: 'Calibri', bold: true } },
      { text: data.completionDate || '—', options: { color: GREY_TEXT, fill: { color: rowFill }, fontSize: 10, fontFace: 'Calibri', align: 'center' } },
      { text: data.notes || '', options: { color: GREY_TEXT, fill: { color: rowFill }, fontSize: 10, fontFace: 'Calibri' } },
    ]);
  });

  slide.addTable(tableRows, {
    x: 0.3, y: 1.2, w: 9.4,
    colW: [4.5, 1.8, 3.1],
    rowH: 0.38,
    border: { pt: 0.5, color: 'CBD5E1' },
  });
}

function addGateway3ChecklistSlide(prs, gatewayTitle, tasks) {
  const slide = prs.addSlide();

  // Header bar
  slide.addShape(prs.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 1.0, fill: { color: KPMG_BLUE },
  });
  slide.addText(`${gatewayTitle} – accreditation`, {
    x: 0.3, y: 0.1, w: 9.4, h: 0.8,
    fontSize: 44, bold: true, color: WHITE, fontFace: 'KPMG Bold',
  });

  const tableRows = [];

  tasks.forEach((task, i) => {
    const rowFill = i % 2 === 0 ? WHITE : KPMG_LIGHT;
    tableRows.push([
      { text: task.task, options: { color: KPMG_BLUE, fill: { color: rowFill }, fontSize: 10, fontFace: 'Calibri', bold: true } },
      { text: task.description || '', options: { color: DARK_TEXT, fill: { color: rowFill }, fontSize: 9, fontFace: 'Calibri' } },
    ]);
  });

  slide.addTable(tableRows, {
    x: 0.3, y: 1.2, w: 9.4,
    colW: [2.5, 6.9],
    rowH: 0.6,
    border: { pt: 0.5, color: 'CBD5E1' },
  });
}

function addScorecardSlide(prs, gatewayTitle, scorecardData) {
  const slide = prs.addSlide();
  
  slide.addShape(prs.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 1.0, fill: { color: KPMG_BLUE },
  });
  slide.addText(`${gatewayTitle} – Scorecard`, {
    x: 0.3, y: 0.1, w: 9.4, h: 0.8,
    fontSize: 44, bold: true, color: WHITE, fontFace: 'KPMG Bold',
  });

  const cols = ['Date', 'Assessor', 'Form of Assessment', 'Req. Met', 'Comments', 'Sent to Ops Mgr', 'Ops Mgr Checks', 'Ops Mgr Confirm', 'Confirmed Next Steps'];
  const keys = ['date', 'assessor', 'formOfAssessment', 'requirementsMet', 'comments', 'sentToOpsManager', 'opsManagerChecks', 'opsManagerConfirmation', 'confirmedNextSteps'];

  const headerRow = cols.map(c => ({
    text: c,
    options: { bold: true, color: WHITE, fill: { color: KPMG_BLUE }, fontSize: 8, fontFace: 'Calibri' },
  }));

  const tableRows = [headerRow];
  const rowData = scorecardData || {};
  
  tableRows.push(keys.map(k => ({
    text: rowData[k] || '—',
    options: { color: DARK_TEXT, fill: { color: WHITE }, fontSize: 8, fontFace: 'Calibri' },
  })));

  slide.addTable(tableRows, {
    x: 0.1, y: 1.2, w: 9.8,
    colW: [0.8, 1.2, 1.2, 0.7, 1.5, 1.0, 1.0, 1.0, 1.4],
    rowH: 0.45,
    border: { pt: 0.5, color: 'CBD5E1' },
  });
}

function addGateway3ScorecardSlide(prs, gatewayTitle, scorecardRows) {
  const slide = prs.addSlide();

  slide.addShape(prs.ShapeType.rect, {
    x: 0, y: 0, w: 10, h: 1.0, fill: { color: KPMG_BLUE },
  });
  slide.addText(`${gatewayTitle} – Scorecard`, {
    x: 0.3, y: 0.1, w: 9.4, h: 0.8,
    fontSize: 44, bold: true, color: WHITE, fontFace: 'KPMG Bold',
  });

  const cols = ['Date', 'Assessment', 'Project (CRT)', 'Project Lead', 'Date Completed', 'Right First Time', 'Brand Gov. Review', 'Quality Comments', 'Pass Level', 'Team Lead Sign Off', 'Sent to Ops Mgr'];
  const keys = ['date', 'assessment', 'projectCrt', 'projectLead', 'dateCompleted', 'rightFirstTime', 'brandGovReview', 'qualityComments', 'passLevel', 'teamLeadSignOff', 'sentToOpsManager'];

  const headerRow = cols.map(c => ({
    text: c,
    options: { bold: true, color: WHITE, fill: { color: KPMG_BLUE }, fontSize: 8, fontFace: 'Calibri' },
  }));

  const tableRows = [headerRow];

  (scorecardRows || []).forEach((row, i) => {
    const rowFill = i % 2 === 0 ? WHITE : KPMG_LIGHT;
    tableRows.push(keys.map(k => ({
      text: row[k] || '—',
      options: { color: DARK_TEXT, fill: { color: rowFill }, fontSize: 8, fontFace: 'Calibri' },
    })));
  });

  slide.addTable(tableRows, {
    x: 0.1, y: 1.2, w: 9.8,
    colW: [0.7, 1.2, 0.8, 0.8, 0.8, 0.7, 0.8, 1.0, 0.8, 0.8, 0.8],
    rowH: 0.45,
    border: { pt: 0.5, color: 'CBD5E1' },
  });
}

export async function generateGatewayPpt(joinerProfile, leaderDataForJoiner, gatewaysData) {
  const prs = new PptxGenJS();
  prs.layout = 'LAYOUT_WIDE';
  prs.title = `Gateway Report – ${joinerProfile.fullName}`;

  // Cover slide
  addHeaderSlide(prs, joinerProfile.fullName, joinerProfile.joiningDate);

  // Per gateway
  gatewaysData.forEach((gateway, idx) => {
    const gwData = leaderDataForJoiner?.[gateway.id] || {};

    // Section title slide
    addGatewaySectionSlide(prs, gateway.title, gateway.deadline, idx + 1);

    // Checklist slide
    if (gateway.id === 'gateway_three') {
      addGateway3ChecklistSlide(prs, gateway.title, gateway.checklist);
    } else {
      addChecklistSlide(prs, gateway.title, gateway.checklist, gwData.checklist, 'Checklist');
    }

    // Assessment slide (if exists)
    if (gateway.assessment?.length) {
      addChecklistSlide(prs, gateway.title, gateway.assessment, gwData.assessment, 'Assessment');
    }

    // Scorecard slide
    if (gateway.id === 'gateway_three') {
      addGateway3ScorecardSlide(prs, gateway.title, Array.isArray(gwData.scorecard) ? gwData.scorecard : []);
    } else {
      addScorecardSlide(prs, gateway.title, gwData.scorecard);
    }
  });

  const fileName = `Gateway_Report_${joinerProfile.fullName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pptx`;
  await prs.writeFile({ fileName });
}
