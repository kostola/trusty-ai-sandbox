import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListVariant,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  Title,
} from "@patternfly/react-core";
import { Link } from "react-router-dom";
import "./AuditOverview.scss";
import SkeletonStripe from "../../Shared/skeletons/SkeletonStripe/SkeletonStripe";
import { AuditToolbarBottom, AuditToolbarTop } from "../AuditToolbar/AuditToolbar";
import ExecutionTable from "../ExecutionTable/ExecutionTable";
import useExecutions from "./useExecutions";
import { formatISO, sub } from "date-fns";

type AuditOverviewProps = {
  dateRangePreset?: {
    fromDate: string;
    toDate: string;
  };
};

const AuditOverview = (props: AuditOverviewProps) => {
  const { dateRangePreset } = props;
  const toPreset = dateRangePreset ? dateRangePreset.toDate : formatISO(new Date(), { representation: "date" });
  const fromPreset = dateRangePreset
    ? dateRangePreset.fromDate
    : formatISO(sub(new Date(), { months: 1 }), { representation: "date" });
  const [searchString, setSearchString] = useState("");
  const [latestSearches, setLatestSearches] = useState<string[] | null>(null);
  const [fromDate, setFromDate] = useState(fromPreset);
  const [toDate, setToDate] = useState(toPreset);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const { loadExecutions, executions } = useExecutions(searchString, fromDate, toDate, pageSize, pageSize * (page - 1));

  useEffect(() => {
    if (executions.status === "SUCCESS") {
      setTotal(executions.data.total);
      // temporary solution: for demo purposes we display the first 3 executions here
      if (latestSearches === null) {
        let searches = [];
        let maxSearches = Math.min(3, executions.data.total);
        for (let i = 0; i < maxSearches; i++) {
          searches.push(executions.data.headers[i].executionId);
        }
        setLatestSearches(searches);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [executions]);

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Title size="3xl" headingLevel="h2">
            Audit Investigation
          </Title>
          <Text component="p">Here you can retrieve all the available information about past cases</Text>
        </TextContent>
      </PageSection>
      <PageSection style={{ minHeight: "50em" }} isFilled={true}>
        <div style={{ marginBottom: "var(--pf-global--spacer--lg)" }}>
          <List variant={ListVariant.inline}>
            <ListItem>Last Opened:</ListItem>
            {latestSearches === null && <SkeletonStripe isInline={true} customStyle={{ height: "inherit" }} />}
            {latestSearches && latestSearches.length === 0 && (
              <span>
                <em>None</em>
              </span>
            )}
            {latestSearches &&
              latestSearches.length > 0 &&
              latestSearches.map((item, index) => {
                let latestSearchId;
                if (item.toString().indexOf("-") > -1) {
                  let splitted = item.split("-");
                  latestSearchId = splitted[splitted.length - 1];
                } else latestSearchId = item;
                return (
                  <ListItem key={`row-${index}`}>
                    <Link to={`/audit/decision/${item}`}>#{latestSearchId}</Link>
                  </ListItem>
                );
              })}
          </List>
        </div>
        <AuditToolbarTop
          setSearchString={setSearchString}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          total={total}
          pageSize={pageSize}
          page={page}
          setPage={setPage}
          setPageSize={setPageSize}
          onRefresh={loadExecutions}
        />

        <ExecutionTable data={executions} />

        <AuditToolbarBottom total={total} pageSize={pageSize} page={page} setPage={setPage} setPageSize={setPageSize} />
      </PageSection>
    </>
  );
};
export default AuditOverview;
