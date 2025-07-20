import { useState, useEffect } from "react";
import styled from "styled-components";
import { colors } from "../styles/common";
import { getReportsPaginated, saveReport } from "../services/reportStorage";
import { analyzeConversationErrors } from "../services/openai";
import Pagination from "./Pagination";

const ReportContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${colors.background.chat};
  overflow: hidden;
`;

const ReportHeader = styled.div`
  padding: 20px;
  background: ${colors.background.header};
  border-bottom: 1px solid ${colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReportTitle = styled.h2`
  margin: 0;
  color: ${colors.text.primary};
  font-size: 24px;
  font-weight: 600;
`;

const RefreshButton = styled.button`
  padding: 12px 20px;
  background: ${colors.primary};
  color: ${colors.text.primary};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ReportContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${colors.text.muted};
  margin-top: 100px;

  h3 {
    margin-bottom: 10px;
    color: ${colors.text.primary};
  }

  p {
    margin-bottom: 20px;
  }
`;

const ReportCard = styled.div`
  background: ${colors.background.main};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ReportCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${colors.border};
`;

const ConversationInfo = styled.div`
  h4 {
    margin: 0 0 4px 0;
    color: ${colors.text.primary};
    font-size: 18px;
    font-weight: 600;
  }

  .meta {
    color: ${colors.text.muted};
    font-size: 14px;
  }
`;

const ReportDate = styled.div`
  color: ${colors.text.muted};
  font-size: 12px;
  text-align: right;
`;

const ErrorsSection = styled.div`
  margin-bottom: 16px;
`;

const SectionTitle = styled.h5`
  margin: 0 0 12px 0;
  color: ${colors.text.primary};
  font-size: 16px;
  font-weight: 600;
`;

const ErrorItem = styled.div`
  background: ${colors.background.input};
  border-left: 4px solid
    ${(props) =>
      props.severity === "high"
        ? "#f44336"
        : props.severity === "medium"
        ? "#ff9800"
        : "#2196f3"};
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 4px;
`;

const ErrorType = styled.span`
  display: inline-block;
  background: ${(props) =>
    props.severity === "high"
      ? "#f44336"
      : props.severity === "medium"
      ? "#ff9800"
      : "#2196f3"};
  color: white;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const ErrorText = styled.div`
  margin: 8px 0;

  .label {
    font-weight: 600;
    color: ${colors.text.primary};
    font-size: 13px;
  }

  .content {
    margin-top: 4px;
    color: ${colors.text.primary};
    font-size: 14px;
    font-family: monospace;
    background: rgba(0, 0, 0, 0.05);
    padding: 6px 8px;
    border-radius: 4px;
  }

  .explanation {
    margin-top: 6px;
    color: ${colors.text.muted};
    font-size: 13px;
    line-height: 1.4;
    font-style: italic;
  }
`;

const Summary = styled.div`
  background: ${colors.background.input};
  padding: 16px;
  border-radius: 8px;
  color: ${colors.text.primary};
  font-size: 14px;
  line-height: 1.5;
`;

const LoadingState = styled.div`
  text-align: center;
  color: ${colors.text.muted};
  margin-top: 50px;

  .spinner {
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 3px solid ${colors.border};
    border-radius: 50%;
    border-top-color: ${colors.primary};
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 5;

  const loadReports = () => {
    const paginatedData = getReportsPaginated(currentPage, itemsPerPage);
    setReports(paginatedData.reports);
    setTotalPages(paginatedData.totalPages);
    setTotalItems(paginatedData.totalItems);
    setIsLoading(false);
  };

  useEffect(() => {
    loadReports();
  }, [currentPage]);

  const generateNewReport = async () => {
    setIsGenerating(true);

    try {
      // Get all chat data from localStorage
      const allChats = JSON.parse(
        localStorage.getItem("english_app_chats") || "{}"
      );
      const contacts = JSON.parse(
        localStorage.getItem("english_app_contacts") || "[]"
      );
      console.log(allChats);

      const reports = [];

      for (const [chatId, messages] of Object.entries(allChats)) {
        if (!messages || messages.length === 0) continue;

        // Find contact name
        const contact = contacts.find((c) => c.id === chatId);
        const contactName = contact ? contact.name : "Unknown Contact";

        // Get conversation date (from first message)
        const firstMessage = messages[0];
        const conversationDate =
          firstMessage && firstMessage.timestamp
            ? new Date(firstMessage.timestamp).toLocaleString()
            : new Date().toLocaleString();

        try {
          const analysis = await analyzeConversationErrors(
            messages,
            contactName,
            conversationDate
          );

          if (analysis.errors && analysis.errors.length > 0) {
            reports.push(analysis);
          }
        } catch (error) {
          console.error(
            `Failed to analyze conversation with ${contactName}:`,
            error
          );
        }
      }

      // Save all reports
      for (const report of reports) {
        await saveReport(report);
      }

      if (reports.length > 0) {
        // Reset to first page and reload
        setCurrentPage(1);
        loadReports();
      }
    } catch (error) {
      console.error("Failed to generate reports:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <ReportContainer>
        <ReportHeader>
          <ReportTitle>📊 문법 분석 리포트</ReportTitle>
        </ReportHeader>
        <LoadingState>
          <div className="spinner"></div>
          <p>리포트를 불러오는 중...</p>
        </LoadingState>
      </ReportContainer>
    );
  }

  return (
    <ReportContainer>
      <ReportHeader>
        <ReportTitle>📊 문법 분석 리포트</ReportTitle>
        <RefreshButton onClick={generateNewReport} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <span>⏳</span>
              분석 중...
            </>
          ) : (
            <>
              <span>🔄</span>새 리포트 생성
            </>
          )}
        </RefreshButton>
      </ReportHeader>

      <ReportContent>
        {reports.length === 0 ? (
          <EmptyState>
            <h3>아직 리포트가 없습니다</h3>
            <p>
              대화를 나눈 후 "새 리포트 생성" 버튼을 클릭하여
              <br />
              문법 분석 리포트를 생성해보세요.
            </p>
          </EmptyState>
        ) : (
          <>
            {reports.map((report) => (
              <ReportCard key={report.id}>
                <ReportCardHeader>
                  <ConversationInfo>
                    <h4>
                      {report.conversationInfo?.contactName ||
                        "Unknown Contact"}
                      와의 대화
                    </h4>
                    <div className="meta">
                      {report.conversationInfo?.date} • 총{" "}
                      {report.conversationInfo?.totalUserMessages || 0}개 메시지
                      •{report.errors?.length || 0}개 오류 발견
                    </div>
                  </ConversationInfo>
                  <ReportDate>
                    리포트 생성: {formatDate(report.timestamp)}
                  </ReportDate>
                </ReportCardHeader>

                {report.errors && report.errors.length > 0 && (
                  <ErrorsSection>
                    <SectionTitle>
                      발견된 문제점 ({report.errors.length}개)
                    </SectionTitle>
                    {report.errors.map((error, index) => (
                      <ErrorItem key={index} severity={error.severity}>
                        <ErrorType severity={error.severity}>
                          {error.errorType} • {error.severity}
                        </ErrorType>
                        <ErrorText>
                          <div className="label">원문:</div>
                          <div className="content">"{error.messageText}"</div>

                          <div className="label">문제점:</div>
                          <div className="content">
                            {error.errorDescription}
                          </div>

                          <div className="label">개선안:</div>
                          <div className="content">"{error.suggestion}"</div>

                          <div className="explanation">{error.explanation}</div>
                        </ErrorText>
                      </ErrorItem>
                    ))}
                  </ErrorsSection>
                )}

                {report.summary && (
                  <div>
                    <SectionTitle>종합 평가</SectionTitle>
                    <Summary>{report.summary}</Summary>
                  </div>
                )}
              </ReportCard>
            ))}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </ReportContent>
    </ReportContainer>
  );
}

export default ReportPage;
