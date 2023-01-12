import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { ChromePicker } from "react-color";
import { LoadingIndicatorPage, useNotification } from "@strapi/helper-plugin";

import { Box } from "@strapi/design-system/Box";
import { Stack } from "@strapi/design-system/Stack";
import { Button } from "@strapi/design-system/Button";
import { Grid, GridItem } from "@strapi/design-system/Grid";
import { Typography } from "@strapi/design-system/Typography";
import { HeaderLayout, ContentLayout } from "@strapi/design-system/Layout";
import { ToggleInput } from "@strapi/design-system/ToggleInput";
import { TimePicker } from "@strapi/design-system/TimePicker";
import { Select, Option } from "@strapi/design-system/Select";


import Check from "@strapi/icons/Check";
import styled from "styled-components";
import api from "../api";
import getTrad from "../utils/getTrad";


const ColorWindow = styled.div`
  background-color: ${(props) => props.color};
  border: ${(props) => props.color === "#FFFFFF" && "1px solid #5B5F65"};
  width: 3rem;
  height: 3rem;
  border-radius: 10%;
  cursor: pointer;
`;

const PopOver = styled.div`
  position: absolute;
  margin-top: 10px;
  z-index: 10;
`;

const Cover = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

function Settings() {
  const { formatMessage } = useIntl();

  const [popOver, setPopOver] = useState(null);
  const [collections, setCollections] = useState([]);
  const [plugins, setPlugins] = useState([]);
  const [fields, setFields] = useState([]);
  const [settings, setSettings] = useState({
    collection: null,
    startField: null,
    endField: null,
    titleField: null,
    colorField: null,
    defaultDuration: 30,
    drafts: true,
    startHour: '0:00',
    endHour: '23:59',
    defaultView: 'Month',
    monthView: true,
    weekView: false,
    dayView: false,
    todayButton: true,
    createButton: true,
    primaryColor: "#4945ff",
    eventColor: "#4945ff",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleNotification = useNotification();

  useEffect(() => {
    api.getCollections().then((res) => {
      setCollections(res.data);
    });
  }, []);

  useEffect(() => {
    api.getRelevantPlugins().then((res) => {
      setPlugins(res.data);
    });
  }, []);

  useEffect(() => {
    if (settings.collection && collections.length) {
      const collection = collections.find((x) => x.uid === settings.collection);
      const fields = Object.entries(collection.attributes)
        .map((x) => ({
          id: x[0],
          ...x[1],
        }))
        .concat(
          plugins.reduce((acc, el) => {
            acc.push(...el.startFields, ...el.endFields);

            return acc;
          }, [])
        );
      setFields(fields);
    }
  }, [settings, collections, plugins]);

  useEffect(() => {
    api.getSettings().then((res) => {
      if (res.data) setSettings(res.data);
      setIsLoading(false);
    });
  }, []);

  const handleSubmit = async () => {
    if (settings.defaultView === "Month" && !settings.monthView) {
      return toggleNotification({
        type: "warning",
        message: "Month view must be enabled",
      });
    }
    if (settings.defaultView === "Week" && !settings.weekView) {
      return toggleNotification({
        type: "warning",
        message: "Week view must be enabled",
      });
    }
    if (settings.defaultView === "Day" && !settings.dayView) {
      return toggleNotification({
        type: "warning",
        message: "Day view must be enabled",
      });
    }
    if (!settings.monthView && !settings.weekView && !settings.dayView) {
      return toggleNotification({
        type: "warning",
        message: "At least one view must be enabled",
      });
    }

    setIsSaving(true);
    const res = await api.setSettings(settings);
    setSettings(res.data);
    setIsSaving(false);

    return toggleNotification({
      type: "success",
      message: "Settings successfully updated",
    });
  };

  return (
    <>
      <HeaderLayout
        id="title"
        title={formatMessage({ id: getTrad("view.settings.title") })}
        subtitle={formatMessage({ id: getTrad("view.settings.subtitle") })}
        primaryAction={
          !isLoading && (
            <Button
              onClick={handleSubmit}
              startIcon={<Check />}
              size="L"
              disabled={isSaving}
              loading={isSaving}
            >
              {formatMessage({ id: getTrad("view.settings.action.save") })}
            </Button>
          )
        }
      />
      {isLoading ? (
        <LoadingIndicatorPage />
      ) : (
        <ContentLayout>
          <Box
            background="neutral0"
            hasRadius
            shadow="filterShadow"
            paddingTop={6}
            paddingBottom={6}
            paddingLeft={6}
            paddingRight={6}
          >
            <Stack spacing={3} paddingBottom={8}>
              <Typography variant="beta">
                {formatMessage({
                  id: getTrad("view.settings.section.general.title"),
                })}
              </Typography>
              <Select
                label={formatMessage({
                  id: getTrad("view.settings.section.general.collection.label"),
                })}
                onChange={(e) => setSettings((s) => ({ ...s, collection: e }))}
                value={settings.collection}
              >
                {collections.map((x) => (
                  <Option key={x.uid} value={x.uid}>
                    {x.collectionName}
                  </Option>
                ))}
              </Select>
              <Grid gap={4} paddingTop={3}>
                <GridItem col={6} s={12}>
                  <Select
                    label={formatMessage({
                      id: getTrad("view.settings.section.general.title.label"),
                    })}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, titleField: e }))
                    }
                    value={settings.titleField}
                  >
                    <Option value="">
                      [
                      {formatMessage({
                        id: getTrad("view.settings.section.general.title.none"),
                      })}
                      ]
                    </Option>
                    {fields
                      .filter((x) => x.type === "string")
                      .map((x) => (
                        <Option key={x.id} value={x.id}>
                          {x.id}
                        </Option>
                      ))}
                  </Select>
                </GridItem>
                <GridItem col={6} s={12}>
                  <Select
                    label={formatMessage({
                      id: getTrad(
                        "view.settings.section.general.default-duration.label"
                      ),
                    })}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, defaultDuration: e }))
                    }
                    value={settings.defaultDuration}
                  >
                    <Option value={30}>
                      {formatMessage({
                        id: getTrad(
                          "view.settings.section.general.default-duration.30min"
                        ),
                      })}
                    </Option>
                    <Option value={60}>
                      {formatMessage({
                        id: getTrad(
                          "view.settings.section.general.default-duration.1h"
                        ),
                      })}
                    </Option>
                    <Option value={90}>
                      {formatMessage({
                        id: getTrad(
                          "view.settings.section.general.default-duration.1.5h"
                        ),
                      })}
                    </Option>
                    <Option value={120}>
                      {formatMessage({
                        id: getTrad(
                          "view.settings.section.general.default-duration.2h"
                        ),
                      })}
                    </Option>
                  </Select>
                </GridItem>
              </Grid>
              <Grid gap={4} paddingTop={3}>
                <GridItem col={6} s={12}>
                  <Select
                    label={formatMessage({
                      id: getTrad("view.settings.section.general.start.label"),
                    })}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, startField: e }))
                    }
                    value={settings.startField}
                  >
                    {fields
                      .filter((x) => x.type === "datetime")
                      .map((x) => (
                        <Option key={x.id} value={x.id}>
                          {x.id}
                        </Option>
                      ))}
                  </Select>
                </GridItem>
                <GridItem col={6} s={12}>
                  <Select
                    label={formatMessage({
                      id: getTrad("view.settings.section.general.end.label"),
                    })}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, endField: e }))
                    }
                    value={settings.endField}
                  >
                    <Option value="">
                      [
                      {formatMessage({
                        id: getTrad("view.settings.section.general.end.none"),
                      })}
                      ]
                    </Option>
                    {fields
                      .filter((x) => x.type === 'datetime')
                      .map((x) => (
                        <Option key={x.id} value={x.id}>
                          {x.id}
                        </Option>
                      ))}
                  </Select>
                </GridItem>
                <GridItem col={6} s={12}>
                  <Select
                    label={formatMessage({
                      id: getTrad('view.settings.section.general.color.label'),
                    })}
                    onChange={(e) => setSettings((s) => ({ ...s, colorField: e }))}
                    value={settings.colorField}
                  >
                    <Option value="">
                      [
                      {formatMessage({
                        id: getTrad('view.settings.section.general.color.none'),
                      })}
                      ]
                    </Option>
                    {fields
                      .filter((x) => x.type === 'string')
                      .map((x) => (
                        <Option key={x.id} value={x.id}>
                          {x.id}
                        </Option>
                      ))}
                  </Select>
                </GridItem>
                <GridItem col={6} s={12}>
                  <Select
                    label={formatMessage({
                      id: getTrad("view.settings.section.general.color.label"),
                    })}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, colorField: e }))
                    }
                    value={settings.colorField}
                  >
                    <Option value="">
                      [
                      {formatMessage({
                        id: getTrad("view.settings.section.general.color.none"),
                      })}
                      ]
                    </Option>
                    {fields
                      .filter((x) => x.type === "string")
                      .map((x) => (
                        <Option key={x.id} value={x.id}>
                          {x.id}
                        </Option>
                      ))}
                  </Select>
                </GridItem>
              </Grid>
              <Box paddingTop={3}>
                <ToggleInput
                  label={formatMessage({
                    id: getTrad(
                      "view.settings.section.general.display-drafts.label"
                    ),
                  })}
                  checked={settings.drafts}
                  offLabel={formatMessage({
                    id: getTrad(
                      "view.settings.section.general.display-drafts.off"
                    ),
                  })}
                  onLabel={formatMessage({
                    id: getTrad(
                      "view.settings.section.general.display-drafts.on"
                    ),
                  })}
                  onChange={(e) => {
                    setSettings((s) => ({
                      ...s,
                      drafts: e.target.checked,
                    }));
                  }}
                />
              </Box>
            </Stack>

            <Stack spacing={3} paddingBottom={0}>
              <Typography variant="beta">
                {formatMessage({
                  id: getTrad("view.settings.section.calendar.title"),
                })}
              </Typography>
              <Stack horizontal spacing={6}>
                <Box>
                  <Typography variant="pi" fontWeight="bold">
                    {formatMessage({
                      id: getTrad(
                        "view.settings.section.calendar.primary-color.title"
                      ),
                    })}
                  </Typography>
                  <Box paddingTop={1} paddingBottom={2}>
                    <ColorWindow
                      color={settings.primaryColor}
                      onClick={() => setPopOver("primaryColor")}
                    />
                    {popOver === "primaryColor" && (
                      <PopOver>
                        <Cover onClick={() => setPopOver(null)} />
                        <ChromePicker
                          color={settings.primaryColor}
                          onChangeComplete={(e) =>
                            setSettings((s) => ({ ...s, primaryColor: e.hex }))
                          }
                        />
                      </PopOver>
                    )}
                  </Box>
                </Box>
                <Box>
                  <Typography variant="pi" fontWeight="bold">
                    {formatMessage({
                      id: getTrad(
                        "view.settings.section.calendar.event-color.title"
                      ),
                    })}
                  </Typography>
                  <Box paddingTop={1} paddingBottom={2}>
                    <ColorWindow
                      color={settings.eventColor}
                      onClick={() => setPopOver("eventColor")}
                    />
                    {popOver === "eventColor" && (
                      <PopOver>
                        <Cover onClick={() => setPopOver(null)} />
                        <ChromePicker
                          color={settings.eventColor}
                          onChangeComplete={(e) =>
                            setSettings((s) => ({ ...s, eventColor: e.hex }))
                          }
                        />
                      </PopOver>
                    )}
                  </Box>
                </Box>
              </Stack>
              <Grid gap={4}>
                <GridItem col={6} s={12}>
                  <TimePicker
                    clearLabel={formatMessage({
                      id: getTrad("view.settings.section.calendar.times.clear"),
                    })}
                    label={formatMessage({
                      id: getTrad(
                        "view.settings.section.calendar.times.start.label"
                      ),
                    })}
                    step={30}
                    value={settings.startHour}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, startHour: e }))
                    }
                  />
                </GridItem>
                <GridItem col={6} s={12}>
                  <TimePicker
                    clearLabel={formatMessage({
                      id: getTrad("view.settings.section.calendar.times.clear"),
                    })}
                    label={formatMessage({
                      id: getTrad(
                        "view.settings.section.calendar.times.end.label"
                      ),
                    })}
                    step={30}
                    value={settings.endHour}
                    onChange={(e) => setSettings((s) => ({ ...s, endHour: e }))}
                  />
                </GridItem>
              </Grid>

              <Stack spacing={3} paddingTop={3}>
                <Select
                  label={formatMessage({
                    id: getTrad(
                      "view.settings.section.calendar.default-view.label"
                    ),
                  })}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, defaultView: e }))
                  }
                  value={settings.defaultView}
                >
                  <Option value="Month">
                    {formatMessage({
                      id: getTrad("view.settings.section.calendar.view.month"),
                    })}
                  </Option>
                  <Option value="Week">
                    {formatMessage({
                      id: getTrad("view.settings.section.calendar.view.week"),
                    })}
                  </Option>
                  <Option value="Day">
                    {formatMessage({
                      id: getTrad("view.settings.section.calendar.view.day"),
                    })}
                  </Option>
                </Select>
                <Box paddingTop={3}>
                  <ToggleInput
                    label={formatMessage({
                      id: getTrad(
                        "view.settings.section.calendar.button.create.label"
                      ),
                    })}
                    checked={settings.createButton}
                    offLabel={formatMessage({
                      id: getTrad("view.settings.section.calendar.button.off"),
                    })}
                    onLabel={formatMessage({
                      id: getTrad("view.settings.section.calendar.button.on"),
                    })}
                    onChange={(e) => {
                      setSettings((s) => ({
                        ...s,
                        createButton: e.target.checked,
                      }));
                    }}
                  />
                </Box>
                <Grid paddingTop={3}>
                  <GridItem col={6} s={12}>
                    <ToggleInput
                      label={formatMessage({
                        id: getTrad(
                          "view.settings.section.calendar.button.today.label"
                        ),
                      })}
                      checked={settings.todayButton}
                      offLabel={formatMessage({
                        id: getTrad(
                          "view.settings.section.calendar.button.off"
                        ),
                      })}
                      onLabel={formatMessage({
                        id: getTrad("view.settings.section.calendar.button.on"),
                      })}
                      onChange={(e) => {
                        setSettings((s) => ({
                          ...s,
                          todayButton: e.target.checked,
                        }));
                      }}
                    />
                  </GridItem>
                  <GridItem col={6} s={12}>
                    <ToggleInput
                      label={formatMessage({
                        id: getTrad(
                          "view.settings.section.calendar.view.month"
                        ),
                      })}
                      checked={settings.monthView}
                      offLabel={formatMessage({
                        id: getTrad("view.settings.section.calendar.view.off"),
                      })}
                      onLabel={formatMessage({
                        id: getTrad("view.settings.section.calendar.view.on"),
                      })}
                      onChange={(e) => {
                        setSettings((s) => ({
                          ...s,
                          monthView: e.target.checked,
                        }));
                      }}
                    />
                  </GridItem>
                </Grid>
                <Grid paddingTop={3}>
                  <GridItem col={6} s={12}>
                    <ToggleInput
                      label={formatMessage({
                        id: getTrad("view.settings.section.calendar.view.week"),
                      })}
                      checked={settings.weekView}
                      offLabel={formatMessage({
                        id: getTrad("view.settings.section.calendar.view.off"),
                      })}
                      onLabel={formatMessage({
                        id: getTrad("view.settings.section.calendar.view.on"),
                      })}
                      onChange={(e) => {
                        setSettings((s) => ({
                          ...s,
                          weekView: e.target.checked,
                        }));
                      }}
                    />
                  </GridItem>
                  <GridItem col={6} s={12}>
                    <ToggleInput
                      label={formatMessage({
                        id: getTrad("view.settings.section.calendar.view.day"),
                      })}
                      checked={settings.dayView}
                      offLabel={formatMessage({
                        id: getTrad("view.settings.section.calendar.view.off"),
                      })}
                      onLabel={formatMessage({
                        id: getTrad("view.settings.section.calendar.view.on"),
                      })}
                      onChange={(e) => {
                        setSettings((s) => ({
                          ...s,
                          dayView: e.target.checked,
                        }));
                      }}
                    />
                  </GridItem>
                </Grid>
              </Stack>
            </Stack>
          </Box>
        </ContentLayout>
      )}
    </>
  );
}

export default Settings;
