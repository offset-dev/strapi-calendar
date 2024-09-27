import React, { useState } from 'react';
import { Box, Grid, TimePicker, Typography, Flex } from '@strapi/design-system';
import { Field, SingleSelect, SingleSelectOption, Toggle } from '@strapi/design-system';

import { useIntl } from 'react-intl';
import { ChromePicker } from 'react-color';
import styled from 'styled-components';

import { getTranslation } from '../../utils/getTranslation';
import { useSettings } from '../../context/Settings';

const CalendarSettings = () => {
  const { formatMessage } = useIntl();
  const { settings, updateField } = useSettings();
  const [popOver, setPopOver] = useState<null | 'primaryColor' | 'eventColor'>(null);

  return (
    <Grid.Root gap={4}>
      <Grid.Item s={12}>
        <Typography variant="beta">
          {formatMessage({
            id: getTranslation('view.settings.section.calendar.title'),
            defaultMessage: 'Calendar settings',
          })}
        </Typography>
      </Grid.Item>

      <Grid.Item s={12}>
        <Flex gap={10}>
          <Box>
            <Field.Label>
              {formatMessage({
                id: getTranslation('view.settings.section.calendar.primary-color.title'),
                defaultMessage: 'Primary Color',
              })}
            </Field.Label>

            <ColorWindow color={settings.primaryColor} onClick={() => setPopOver('primaryColor')} />
            {popOver === 'primaryColor' && (
              <PopOver>
                <Cover onClick={() => setPopOver(null)} />
                <ChromePicker
                  color={settings.primaryColor}
                  onChangeComplete={(e: { hex: string }) => updateField({ primaryColor: e.hex })}
                />
              </PopOver>
            )}
          </Box>

          <Box>
            <Field.Label>
              {formatMessage({
                id: getTranslation('view.settings.section.calendar.event-color.title'),
                defaultMessage: 'Event Color',
              })}
            </Field.Label>
            <ColorWindow color={settings.eventColor} onClick={() => setPopOver('eventColor')} />

            {popOver === 'eventColor' && (
              <PopOver>
                <Cover onClick={() => setPopOver(null)} />
                <ChromePicker
                  color={settings.eventColor}
                  onChangeComplete={(e: { hex: string }) => updateField({ eventColor: e.hex })}
                />
              </PopOver>
            )}
          </Box>
        </Flex>
      </Grid.Item>

      <Grid.Item col={6} s={12}>
        <Field.Root style={{ width: '100%' }}>
          <Field.Label>
            {formatMessage({
              id: getTranslation('view.settings.section.calendar.times.start.label'),
              defaultMessage: 'Start Hour',
            })}
          </Field.Label>
          <TimePicker
            clearLabel={formatMessage({
              id: getTranslation('view.settings.section.calendar.times.clear'),
              defaultMessage: 'Clear Time',
            })}
            step={60}
            value={settings.startHour}
            onChange={(e: string) => updateField({ startHour: e })}
          />
        </Field.Root>
      </Grid.Item>

      <Grid.Item col={6} s={12}>
        <Field.Root style={{ width: '100%' }}>
          <Field.Label>
            {formatMessage({
              id: getTranslation('view.settings.section.calendar.times.end.label'),
              defaultMessage: 'End Hour',
            })}
          </Field.Label>
          <TimePicker
            clearLabel={formatMessage({
              id: getTranslation('view.settings.section.calendar.times.clear'),
              defaultMessage: 'Clear Time',
            })}
            step={60}
            value={settings.endHour}
            onChange={(e: string) => updateField({ endHour: e })}
          />
        </Field.Root>
      </Grid.Item>

      <Grid.Item s={12}>
        <Field.Root style={{ width: '100%' }}>
          <Field.Label>
            {formatMessage({
              id: getTranslation('view.settings.section.calendar.default-view.label'),
              defaultMessage: 'Default View',
            })}
          </Field.Label>
          <SingleSelect
            onChange={(e: string) => updateField({ defaultView: e })}
            value={settings.defaultView}
          >
            <SingleSelectOption value="Month">
              {formatMessage({
                id: getTranslation('view.settings.section.calendar.view.month'),
                defaultMessage: 'Month View',
              })}
            </SingleSelectOption>
            <SingleSelectOption value="Week">
              {formatMessage({
                id: getTranslation('view.settings.section.calendar.view.week'),
                defaultMessage: 'Week View',
              })}
            </SingleSelectOption>
            <SingleSelectOption value="Work-Week">
              {formatMessage({
                id: getTranslation('view.settings.section.calendar.view.work-week'),
                defaultMessage: 'Work Week View',
              })}
            </SingleSelectOption>
            <SingleSelectOption value="Day">
              {formatMessage({
                id: getTranslation('view.settings.section.calendar.view.day'),
                defaultMessage: 'Day View',
              })}
            </SingleSelectOption>
          </SingleSelect>
        </Field.Root>
      </Grid.Item>

      <Grid.Item col={6} s={12}>
        <Field.Root style={{ minWidth: 300 }}>
          <Field.Label>
            {formatMessage({
              id: getTranslation('view.settings.section.calendar.view.month'),
              defaultMessage: 'Month View',
            })}
          </Field.Label>
          <Toggle
            checked={settings.monthView}
            offLabel={formatMessage({
              id: getTranslation('view.settings.section.calendar.view.off'),
              defaultMessage: 'Disabled',
            })}
            onLabel={formatMessage({
              id: getTranslation('view.settings.section.calendar.view.on'),
              defaultMessage: 'Enabled',
            })}
            onChange={(e: any) => {
              updateField({
                monthView: e.target.checked,
              });
            }}
          />
        </Field.Root>
      </Grid.Item>

      <Grid.Item col={6} s={12}>
        <Field.Root style={{ minWidth: 300 }}>
          <Field.Label>
            {formatMessage({
              id: getTranslation('view.settings.section.calendar.view.week'),
              defaultMessage: 'Week View',
            })}
          </Field.Label>
          <Toggle
            checked={settings.weekView}
            offLabel={formatMessage({
              id: getTranslation('view.settings.section.calendar.view.off'),
              defaultMessage: 'Disabled',
            })}
            onLabel={formatMessage({
              id: getTranslation('view.settings.section.calendar.view.on'),
              defaultMessage: 'Enabled',
            })}
            onChange={(e: any) => {
              updateField({
                weekView: e.target.checked,
              });
            }}
          />
        </Field.Root>
      </Grid.Item>

      <Grid.Item col={6} s={12}>
        <Field.Root style={{ minWidth: 300 }}>
          <Field.Label>
            {formatMessage({
              id: getTranslation('view.settings.section.calendar.view.work-week'),
              defaultMessage: 'Work Week',
            })}
          </Field.Label>
          <Toggle
            checked={settings.workWeekView}
            offLabel={formatMessage({
              id: getTranslation('view.settings.section.calendar.view.off'),
              defaultMessage: 'Disabled',
            })}
            onLabel={formatMessage({
              id: getTranslation('view.settings.section.calendar.view.on'),
              defaultMessage: 'Enabled',
            })}
            onChange={(e: any) => {
              updateField({
                workWeekView: e.target.checked,
              });
            }}
          />
        </Field.Root>
      </Grid.Item>

      <Grid.Item col={6} s={12}>
        <Field.Root style={{ minWidth: 300 }}>
          <Field.Label>
            {formatMessage({
              id: getTranslation('view.settings.section.calendar.view.day'),
              defaultMessage: 'Day View',
            })}
          </Field.Label>
          <Toggle
            checked={settings.dayView}
            offLabel={formatMessage({
              id: getTranslation('view.settings.section.calendar.view.off'),
              defaultMessage: 'Disabled',
            })}
            onLabel={formatMessage({
              id: getTranslation('view.settings.section.calendar.view.on'),
              defaultMessage: 'Enabled',
            })}
            onChange={(e: any) => {
              updateField({
                dayView: e.target.checked,
              });
            }}
          />
        </Field.Root>
      </Grid.Item>

      <Grid.Item col={6} s={12}>
        <Field.Root style={{ minWidth: 300 }}>
          <Field.Label>
            {formatMessage({
              id: getTranslation('view.settings.section.calendar.button.create.label'),
              defaultMessage: 'Create Button',
            })}
          </Field.Label>
          <Toggle
            checked={settings.createButton}
            offLabel={formatMessage({
              id: getTranslation('view.settings.section.calendar.button.off'),
              defaultMessage: 'Disabled',
            })}
            onLabel={formatMessage({
              id: getTranslation('view.settings.section.calendar.button.on'),
              defaultMessage: 'Enabled',
            })}
            onChange={(e: any) => {
              updateField({
                createButton: e.target.checked,
              });
            }}
          />
        </Field.Root>
      </Grid.Item>

      <Grid.Item col={6} s={12}>
        <Field.Root style={{ minWidth: 300 }}>
          <Field.Label>
            {formatMessage({
              id: getTranslation('view.settings.section.calendar.button.today.label'),
              defaultMessage: 'Today Button',
            })}
          </Field.Label>
          <Toggle
            checked={settings.todayButton}
            offLabel={formatMessage({
              id: getTranslation('view.settings.section.calendar.button.off'),
              defaultMessage: 'Disabled',
            })}
            onLabel={formatMessage({
              id: getTranslation('view.settings.section.calendar.button.on'),
              defaultMessage: 'Enabled',
            })}
            onChange={(e: any) => {
              updateField({
                todayButton: e.target.checked,
              });
            }}
          />
        </Field.Root>
      </Grid.Item>
    </Grid.Root>
  );
};

const ColorWindow = styled.div`
  background-color: ${(props) => props.color};
  border: ${(props) => props.color === '#FFFFFF' && '1px solid #5B5F65'};
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

export default CalendarSettings;
