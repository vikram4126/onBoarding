import PptxGenJS from 'pptxgenjs';

const KPMG_BLUE = '00338D';
const KPMG_LIGHT = 'E8EEF7';
const WHITE = 'FFFFFF';
const DARK_TEXT = '1E293B';
const GREY_TEXT = '64748B';

const KPMG_LOGO_WHITE_BASE64 = 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjMwIiB2aWV3Qm94PSIwIDAgNzcgMzAiIHdpZHRoPSI3NyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtNTkuNDI5Ny4wODk0MTY1djE0Ljg5OTI4MzVsLS4xOTM1LjE1Ny0uMTkzNS4xNTctLjE4NTUuMTY0OS0uMTc3My4xNjQ4LS4xNjkzLjE2NDktLjE2OTMuMTcyNy0uMTYxMy4xNzI3LS4xNjEyLjE3Mjd2LTE2LjIyNTk4MzVoLTE2Ljk1NDl2MTMuNTY0NzgzNWgtMS40MDI4di0xMy41NjQ3ODM1aC0xNi45NTQ5djEzLjU4ODM4MzVoLTEuNDAyOHYtMTMuNTg4MzgzNWgtMTYuOTU0ODd2MTUuNDg4MDgzNWwtNC4zMjk0MjYgMTQuMDQzNmgzLjgwNTM3NmwxLjkxMDc1LTYuMjE3MmguNTQ4MjNsMy4xNjAzOSA2LjIxNzJoNC41OTU0NWwtMy4wNjM2LTYuMjE3Mmg2Ljk0OTZsLTEuOTI2OSA2LjIxNzJoNC4xNTIxbDEuOTAyNy02LjIwMTVoLjkxOTF2LS4wMTU3aDEuMzA2LjEwNDkgNy44NDQ1bC0xLjgzODIgNi4yMDE1aDQuMTkyNGwxLjc4MTctNi4yMDE1aDEuODg2NmwuMDQ4MyA2LjIwMTVoMy41MTUybDQuMDM5MS02LjIwMTVoMi42NDQ0bC0xLjM3MDUgNi4yMDE1aDQuMTI3OGwxLjM0NjQtNi4yMDE1aDIuMzg2NGwtLjAxNjEuMzUzMy4wMDg2LjM2MTEuMDE2MS4zNDUzLjAzMjIuMzQ1NS4wMjQyLjE2NDguMDI0MS4xNjQ5LjAzMjIuMTY0OC4wMzIzLjE2NDkuMDQwMi4xNjQ4LjA0MDMuMTU3LjA0ODQuMTU3LjA0ODMuMTU3LjA1NjUuMTU3LjA1NjUuMTQ5Mi4wNjQ0LjE0OTEuMDY0Ni4xNDEzLjA3MjYuMTQ5Mi4wNzI1LjE0MTMuMDgwNy4xMzM0LjA4MDcuMTQxMy4wODg3LjEzMzUuMDk2Ny4xMjU2LjA5NjguMTMzNC4xMDQ4LjExNzguMTA0OC4xMjU2LjEwNDguMTE3Ny4xMjA5LjExNzguMTIxLjEwOTkuMTUzMS4xMjU2LjE1MzIuMTI1Ni4xNjEzLjExNzcuMTY5My4xMDk5LjE2OTMuMTA5OS4xNjkzLjEwMjEuMTc3NC4wODYzLjE4NTQuMDk0Mi4xNzc0LjA3ODUuMTg1NC4wNzg0LjE4NTQuMDcwNy4xOTM1LjA3MDcuMTkzNS4wNjI4LjE5MzUuMDU1LjE5MzUuMDU0OS4xOTM1LjA0NzEuMzg3LjA4NjMuMzk1LjA2MjkuMzg3LjA1NDkuMzg3LjA0NzEuMzc4OS4wMzE0LjM3MDkuMDE1Ny4zNjI4LjAxNThoLjM0NjZsLjQ2NzctLjAwNzUuNDY3Ni0uMDA3NC40NzU2LS4wMjM2LjQ3NTctLjAyMzYuNDc1Ny0uMDM5Mi40NzU3LS4wMzkzLjQ3NTYtLjA0NzEuNDc1Ny0uMDU1LjQ4MzctLjA2MjguNDgzOC0uMDcwNy40ODM3LS4wNzg1LjQ4MzctLjA3ODUuNDgzOC0uMDg2My40ODM3LS4wOTQyLjQ4MzctLjA5NDIuNDkxOC0uMTA5OSAxLjQzNTEtNS42Mjg0aDQuNzA4NHYtMjMuMzE0NTU3M2gtMTYuOTU0OXptLTUzLjUwOTA1IDIyLjczMzU4MzUuMDI0MTctLjA4NjMuMDU2NDkuMDg2M3ptMTQuNzcwMDUtOC4zNTI0LS4yNDE5Ljc5MjktMi4yNTc0IDcuMzAwNS0uMDg4Ny4yNTloLTcuNDE3M2wtLjU3MjQtMS4xOTMyIDcuOTg5Ny03Ljk1MmgtNS4xMzU3bC02LjI0ODIgNi41NTQ3IDIuMDIzNjEtNi41NTQ3aC0zLjc4OTI0di0xMi45OTk2MjdoMTUuNzM3NDN2MTMuNzkyNDI3em00LjM3NzcgNi4xNzAxLS4xMjA5LjAwNzUtLjExMjkuMDA3NC0uMTIwOS4wMDc1aC0uMTI5LS4xNjkzLS4xNDUxbC0uMTM3MS4wMDc0aC0uMTI5bC0xLjAwNzctLjAwNzQuNDY3Ni0xLjY3OTkuMjE3Ni0uODMyMS41MzIyLTEuOTU0N2guMTY5My4xNzczbC4xNjkzLS4wMDc0aC4xNjEzLjc4MmwuNDc1Ny4wMDc0LjQzNTMuMDE1OC4xOTM1LjAwNzQuMTg1NS4wMTU3LjE3NzMuMDIzNi4xNjEzLjAyMzYuMTQ1MS4wMjM1LjEzNzEuMDM5My4xMjkuMDM5My4xMTI4LjA0NzEuMDk2OC4wNDcxLjA4ODcuMDYyOS4wODA2LjA2MjguMDY0NS4wNzg1LjA0MDMuMDYyOS4wMzIyLjA2MjguMDMyMi4wNzA3LjAyNDIuMDc4NS4wMTYxLjA4NjMuMDA4NS4wODYzdi4wOTQyLjEwMmwtLjAwODUuMTA5OS0uMDA3Ni4xMDk5LS4wMjQyLjEyNTYtLjAyNDEuMTI1Ni0uMDcyNi4yNjY5LS4wODg3LjI5ODMtLjA4ODcuMjUxMi0uMDk2OC4yNDM0LS4xMDQ4LjIyNzYtLjExMjkuMjEyLS4wNTY1LjA5NDItLjA1NjQuMDk0Mi0uMDY0Ni4wOTQyLS4wNzI2LjA4NjMtLjA3MjYuMDg2My0uMDcyNi4wNzg1LS4wODA2LjA3ODUtLjA4MDcuMDcwNi0uMDg4Ny4wNjI5LS4wODg3LjA3MDctLjA5NjcuMDU0OS0uMTA0OS4wNjI4LS4xMDQ4LjA1NS0uMTEyOC4wNDcxLS4xMTI5LjA0NzEtLjEyMDkuMDM5My0uMTI5LjA0NzEtLjEzNzEuMDMxNC0uMTQ1MS4wMzE0LS4xNDUxLjAzMTMtLjE2MTMuMDIzNi0uMTYxMi4wMjM2LS4xNjkzLjAxNTctLjE3NzQuMDE1N3ptMTEuNDY0NSAyLjE4MjMgMS42NTI4LTUuNzMwNS4wNjQ1IDUuNzMwNWgtMS43MTcyem0yLjUxNTUtOS4xNjg4aC0zLjkzNDRsLTIuNzA4OSA5LjE2ODhoLTQuMTc2M2wuMTkzNS0uMDc4NC4xOTM1LS4wNzg1LjE4NTUtLjA3ODUuMTg1NC0uMDg2My4xNzc0LS4wODY0LjE2OTMtLjEwMi4xNjkzLS4wOTQyLjE2MTItLjEwMjEuMTYxMy0uMTA5OS4xNTMxLS4xMDk5LjE0NTItLjEwOTguMTQ1MS0uMTI1Ny4xMzctLjExNzcuMTI5LS4xMzM1LjEyOS0uMTI1Ni4xMjEtLjE0MTMuMTIwOS0uMTMzNC4xMTI5LS4xNDkyLjEwNDgtLjE0MTMuMTA0OC0uMTU3LjA5NjctLjE1Ny4wODg3LS4xNTY5LjA4ODgtLjE2NDkuMDgwNi0uMTcyNy4wODA3LS4xNzI3LjA3MjYtLjE3MjcuMDY0NC0uMTgwNi4wNjQ1LS4xODg0LjA0ODQtLjE4ODQuMDU2NS0uMTg4NC4wNDAyLS4yMDQxLjA0MDMtLjE5NjIuMDU2NS0uMzE0LjA0ODMtLjI5ODMuMDMyMy0uMjgyNi4wMjQxLS4yNjY5LjAwODYtLjI2NjktLjAwODYtLjI0MzQtLjAwNzUtLjI0MzMtLjAzMjMtLjIyNzctLjAzMjItLjIxMTktLjA1NjUtLjIxMi0uMDU2NS0uMTk2Mi0uMDgwNi0uMTg4NC0uMDg4Ny0uMTgwNi0uMDk2OC0uMTgwNS0uMTEyOC0uMTY0OS0uMTI5LS4xNTctLjEwNDktLjEwOTktLjEwNDgtLjEwOTktLjExMjgtLjA5NDItLjEyMS0uMDg2My0uMTI5LS4wODYzLS4xMjktLjA3ODUtLjEzNy0uMDcwNi0uMTM3MS0uMDYyOS0uMTQ1MS0uMDYyOC0uMTQ1MS0uMDQ3MS0uMTUzMi0uMDQ3Mi0uMTUzMi0uMDQ3MS0uMTYxMi0uMDM5My0uMTYxMy0uMDMxMy0uMTYxMi0uMDMxNC0uMTY5My0uMDIzNi0uMzQ2Ny0uMDQ3MS0uMzQ2Ny0uMDIzNS0uMzU0Ny0uMDIzNi0uMzYyOC0uMDA3NGgtLjcyNTYtLjcxNzUtLjIyNTgtLjQwMzEuNDk5OS0uNTU2My0uNTQwMS0uNDU5Ni0uMzIyNS0uMTIwOXYtMTIuOTc2MTA4aDE1LjczNzV2MTIuOTc2MTA4em05LjU2MTcgOS4xNjg4aC0yLjM2MjJsMy41Nzk2LTUuNDk1em04Ljc5NTktOC45MDk3LS4wMDg1IDMuMTc5Mi0uMjAxNS4yNzQ4LS4xODU1LjI4MjYtLjE4NTQuMjgyNi0uMTY5My4yODI2LS4xNjEzLjI4MjYtLjE2MTIuMjkwNC0uMTM3MS4yODI2LS4xMzcuMjgyNi0uMTI5LjI3NDgtLjExMjkuMjgyNi0uMTEyOS4yNzQ3LS4wOTY3LjI2NjktLjA4ODcuMjY2OS0uMDgwNy4yNTkxLS4wNzI2LjI1MTItLjA2NDUuMjUxMi0uMDQwMy4xNjQ4LS4wNDAzLjE3MjctLjA0MDIuMTY0OS0uMDMyMy4xNzI3LS4wMzIyLjE2NDgtLjAyNDIuMTY0OS0uMDI0MS4xNjQ4LS4wMTYxLjE3MjdoLTIuMzEzOWwxLjk3NTMtOS4xNDUyLTYuNjU5NC0uMDA3NS01Ljk1OCA5LjE1MzFoLS40MzU0di0yMi4xNDQ4MjdoMTUuNzQ1NXYxMy4yMzUxMjd6bTkuMDc4MSAxMi42NTQyLS4zMzA1LjA1NDktLjMzODcuMDQ3MS0uMzM4Ni4wNDcxLS4zMzA1LjAzOTMtLjMzMDYuMDMxNC0uMzMwNS4wMjM2LS4zMjI1LjAxNTdoLS4zMjI1LS4yMDk2bC0uMjA5Ni0uMDA3NC0uMjAxNi0uMDE1OC0uMjAxNS0uMDIzNS0uMTkzNS0uMDMxNC0uMTg1NS0uMDMxNC0uMTg1NC0uMDM5My0uMTc3NC0uMDQ3MS0uMTY5My0uMDU0OS0uMTY5My0uMDU1LS4xNjEyLS4wNzA2LS4xNTMyLS4wNzA3LS4xNTMyLS4wODYzLS4xNDUxLS4wODYzLS4xMzcxLS4wOTQyLS4xMjktLjA5NDItLjEyOS0uMTA5OS0uMTEyOC0uMTE3OC0uMTEyOS0uMTE3Ny0uMTA0OC0uMTMzNS0uMDk2OC0uMTMzNC0uMDg4Ny0uMTQ5Mi0uMDgwNi0uMTQ5MS0uMDgwNy0uMTU3LS4wNjQ1LS4xNjQ5LS4wNTY1LS4xODA1LS4wNDgzLS4xODA2LS4wNDg0LS4xODg0LS4wMzIyLS4xOTYyLS4wMjQyLS4yMDQxLS4wMTYxLS4yMTItLjAwODUtLjIxOThoNy4zMzY2bC0uODA2MiAzLjE2MzZ6bTkuMzAzOC0zLjc0NDVoLTMuOTY2NmwuNjUzLTIuNTU5MWgtNy45NDkzbC0uNjUzMSAyLjU1OTFoLTMuODQ1NnYtLjUyNTlsLjA0ODMtLjIxOTguMDQwMy0uMjE5OC4wNDgzLS4yMzU1LjA0ODMtLjIzNTUuMDcyNi0uMjU5MS4wNzI2LS4yNTkuMDgwNy0uMjU5MS4wODg3LS4yNTEyLjA5NjctLjI1MTIuMTA0OS0uMjUxMi4xMTI4LS4yNDMzLjExMjktLjI0MzQuMTI5LS4yNDMzLjEyOS0uMjI3Ny4xMzcxLS4yMzU1LjE1MzEtLjIxOTguMTUzMi0uMjE5OC4xNTMyLS4yMTE5LjE2OTMtLjIwNDEuMTc3NC0uMTk2My4xODU0LS4xODg0LjE4NTQtLjE3MjcuMjAxNi0uMTcyNy4yMDE1LS4xNjQ4LjIwOTctLjE0OTIuMjI1Ny0uMTQxMy4yMjU4LS4xMjU2LjIzMzgtLjExNzcuMjQxOC0uMTA5OS4yNDk5LS4wOTQyLjI1OC0uMDc4NS4yNjYxLS4wNjI5LjI3NDEtLjA1NDkuMjgyMi0uMDM5My4yOTAyLS4wMjM1LjI5ODMtLjAwNzUuMjMzOC4wMDc1LjIzMzguMDE1Ny4yMzM4LjAzMTQuMjI1OC4wNDcxLjExMjkuMDMxNC4xMDQ4LjAzMTMuMTA0OC4wMzE0LjA5NjcuMDQ3MS4wOTY4LjAzOTMuMDk2Ny4wNTUuMDg4Ny4wNTQ5LjA4ODcuMDU0OS4wODA3LjA3MDcuMDgwNi4wNzA3LjA3MjYuMDcwNi4wNzI2LjA4NjMuMDY0Ni4wNzg1LjA1NjUuMDk0Mi4wNDgzLjEwMjEuMDQ4My4xMDIuMDQwMy4xMDk5LjAzMjIuMTE3OC4wMjQyLjExNzcuMDI0Mi4xMzM1LjAwODUuMTMzNHYuMTQxMy4xNDkybC0uMDE2MS4xNTdoNC43NDA2bC4wNzI2LS4zMjE5LjA2NDUtLjM2ODkuMDMyMi0uMTk2My4wMTYyLS4yMTE5LjAxNjEtLjIxMnYtLjIxOThsLS4wMDc2LS4yMjc2LS4wMjQyLS4yMzU1LS4wMjQxLS4xMDk5LS4wMTYyLS4xMTc4LS4wMzIyLS4xMTc3LS4wMzIyLS4xMTc4LS4wNDAzLS4xMjU2LS4wNDAzLS4xMTc3LS4wNDgzLS4xMTc4LS4wNTY1LS4xMTc3LS4wNTY1LS4xMTc4LS4wNzI2LS4xMTc3LS4wNzI2LS4xMTc4LS4wODA2LS4xMTc3LS4wOTY4LS4xMjU2LS4xMDQ4LS4xMTc4LS4xMDQ4LS4xMTc3LS4xMTI5LS4xMDk5LS4xMjA5LS4xMDk5LS4xMjktLjEwMjEtLjEyOS0uMDk0Mi0uMTM3LS4wOTQyLS4xNDUyLS4wOTQyLS4xNDUxLS4wNzg1LS4xNTMyLS4wNzg0LS4xNjEyLS4wNzg1LS4xNjEyLS4wNzA3LS4xNjk0LS4wNzA3LS4xNzczLS4wNjI4LS4xNzc0LS4wNjI5LS4xNzc0LS4wNTQ5LS4xOTM1LS4wNDcxLS4xODU0LS4wNDcxLS4yMDE1LS4wNDcxLS4yMDE2LS4wMzkzLS4yMDE2LS4wMzkzLS4yMDk2LS4wMzE0LS4yMTc3LS4wMjM2LS40NDM0LS4wNDcxLS40NTE1LS4wMzkzLS40NzU2LS4wMTU3LS40ODM4LS4wMDc0LS4zNjI4LjAwNzQtLjM3ODkuMDA3NS0uMzk1LjAyMzUtLjQxMTIuMDMxNC0uNDI3My4wNDcxLS40MzU0LjA1NDktLjQ0MzQuMDcwNy0uNDUxNS4wOTQyLS4yMjU3LjA0NzEtLjIzMzguMDU0OS0uMjI1OC4wNjI5LS4yMzM4LjA2MjgtLjIzMzguMDcwNy0uMjMzOC4wNzg1LS4yMzM4LjA3ODUtLjIyNTcuMDg2My0uMjMzOC4wOTQyLS4yMzM4LjEwMi0uMjI1OC4xMDIxLS4yMzM4LjEwOTktLjIyNTcuMTE3Ny0uMjI1OC4xMjU2LS4yMjU3LjEyNTYtLjIyNTguMTQxM3YtMTMuODk0NDYzYTE1Ljc2MTd2MjIuMTQ0ODYzeiIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg==';

function addHeaderSlide(prs, joinerName, joiningDate) {
  const slide = prs.addSlide();
  slide.background = { color: KPMG_BLUE };

  // KPMG Boxed Logo
  slide.addImage({ data: KPMG_LOGO_WHITE_BASE64, x: 0.5, y: 0.4, w: 1.8, h: 0.7 });

  // Large purple/blue rectangle
  slide.addShape(prs.ShapeType.rect, {
    x: 0.8, y: 1.6, w: 6.5, h: 4.0, fill: { color: '6236FF' },
  });

  // Main Title inside rectangle
  slide.addText('CREATE – Training &\nCompetency\nFramework', {
    x: 1.1, y: 1.9, w: 6.0, h: 2.5,
    fontSize: 66, bold: true, color: WHITE, fontFace: 'KPMG Bold', align: 'left',
  });

  // Name and Date inside rectangle (bottom)
  slide.addText(`${joinerName}\nStart date: ${joiningDate}`, {
    x: 1.1, y: 4.5, w: 6.0, h: 0.8,
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
