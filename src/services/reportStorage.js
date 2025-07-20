const STORAGE_KEY = 'english_app_reports';

export const saveReport = (report) => {
  try {
    const existingReports = getReports();
    const newReport = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...report
    };
    
    const updatedReports = [newReport, ...existingReports];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
    
    return newReport;
  } catch (error) {
    console.error('Failed to save report:', error);
    throw error;
  }
};

export const getReports = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load reports:', error);
    return [];
  }
};

export const deleteReport = (reportId) => {
  try {
    const existingReports = getReports();
    const filteredReports = existingReports.filter(report => report.id !== reportId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredReports));
    return true;
  } catch (error) {
    console.error('Failed to delete report:', error);
    return false;
  }
};

export const clearAllReports = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear reports:', error);
    return false;
  }
};

export const getReportsPaginated = (page = 1, itemsPerPage = 10) => {
  const allReports = getReports();
  const totalItems = allReports.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    reports: allReports.slice(startIndex, endIndex),
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage
  };
};