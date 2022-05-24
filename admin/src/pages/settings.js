import React, { useEffect, useState } from 'react';

import api from '../api'

import { LoadingIndicatorPage, useNotification } from '@strapi/helper-plugin';

import { Box } from '@strapi/design-system/Box';
import { Stack } from '@strapi/design-system/Stack';
import { Button } from '@strapi/design-system/Button';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { Typography } from '@strapi/design-system/Typography';
import { HeaderLayout, ContentLayout } from '@strapi/design-system/Layout';
import { ToggleInput } from '@strapi/design-system/ToggleInput';
import { TimePicker } from '@strapi/design-system/TimePicker';
import { Select, Option } from '@strapi/design-system/Select';

import Check from '@strapi/icons/Check';

const Settings = () => {
  const [collections, setCollections] = useState([]);
  const [fields, setFields] = useState([]);
  const [settings, setSettings] = useState({
    collection: null,
    startField: null,
    endField: null,
    titleField: null,
    startHour: "0:00",
    endHour: "0:00",
    defaultView: "Month",
    monthView: true,
    weekView: false,
    dayView: false,
    todayButton: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleNotification = useNotification();

  useEffect(() => {
    api.getCollections().then(res => {
      setCollections(res.data)
    })
  }, []);

  useEffect(() => {
    if (settings.collection && collections.length) {
      const collection = collections.find(x => x.uid === settings.collection);
      const fields = Object.entries(collection.attributes).map(x => ({
        id: x[0],
        ...x[1]
      }));
      setFields(fields)
    }
  }, [settings, collections]);


  useEffect(() => {
    api.getSettings().then(res => {
      setSettings(res.data.body);
      setIsLoading(false);
    });
  }, []);

  const handleSubmit = async () => {
    if (settings.defaultView === "Month" && !settings.monthView){
      return toggleNotification({
        type: 'warning',
        message: 'Month view must be enabled',
      })
    }
    if (settings.defaultView === "Week" && !settings.weekView){
      return toggleNotification({
        type: 'warning',
        message: 'Week view must be enabled',
      })
    }
    if (settings.defaultView === "Day" && !settings.dayView){
      return toggleNotification({
        type: 'warning',
        message: 'Day view must be enabled',
      })
    }
    if (!settings.monthView && !settings.weekView && !settings.dayView) {
      return toggleNotification({
        type: 'warning',
        message: 'At least one view must be enabled'
      })
    }

    setIsSaving(true);
    const res = await api.setSettings(settings);
    setSettings(res.data.body);
    setIsSaving(false);
    toggleNotification({
      type: 'success',
      message: 'Settings successfully updated',
    });
  };

  return (
    <>
      <HeaderLayout
        id='title'
        title='Calendar settings'
        subtitle='Configure the plugin to your needs'
        primaryAction={
          isLoading ? (
            <></>
          ) : (
            <Button
              onClick={handleSubmit}
              startIcon={<Check />}
              size='L'
              disabled={isSaving}
              loading={isSaving}
            >
              Save
            </Button>
          )
        }
      ></HeaderLayout>
      {isLoading ? (
        <LoadingIndicatorPage />
      ) : (
        <ContentLayout>
          <Box
            background='neutral0'
            hasRadius
            shadow='filterShadow'
            paddingTop={6}
            paddingBottom={6}
            paddingLeft={6}
            paddingRight={6}
          >
            <Stack spacing={3} paddingBottom={8}>
              <Typography variant={'beta'}>General settings</Typography>
              <Select label={'Choose your collection'} onChange={e => setSettings(s => ({...s, collection: e}))} value={settings.collection}>
                {collections.map(x => <Option key={x.uid} value={x.uid}>{x.collectionName}</Option>)}
              </Select>
              <Grid gap={2}>
                <GridItem col={4} s={12}>
                  <Select label={'Choose your title field'} onChange={e => setSettings(s => ({...s, titleField: e}))} value={settings.titleField}>
                    <Option value={''}>[No title field]</Option>
                    {fields.filter(x => x.type === "string").map(x => <Option key={x.id} value={x.id}>{x.id}</Option>)}
                  </Select>
                </GridItem>
                <GridItem col={4} s={12}>
                  <Select label={'Choose your start field'} onChange={e => setSettings(s => ({...s, startField: e}))} value={settings.startField}>
                    {fields.filter(x => x.type === "datetime").map(x => <Option key={x.id} value={x.id}>{x.id}</Option>)}
                  </Select>
                </GridItem>
                <GridItem col={4} s={12}>
                  <Select label={'Choose your end field'} onChange={e => setSettings(s => ({...s, endField: e}))} value={settings.endField}>
                    <Option value={''}>[No end field]</Option>
                    {fields.filter(x => x.type === "datetime").map(x => <Option key={x.id} value={x.id}>{x.id}</Option>)}
                  </Select>
                </GridItem>
              </Grid>
            </Stack>

            <Stack spacing={3} paddingBottom={8}>
              <Typography variant={'beta'}>Calendar settings</Typography>
              <Grid gap={2}>
                <GridItem col={6} s={12}>
                  <TimePicker clearLabel={"Clear Time"} label={'Start Hour'} step={30} value={settings.startHour} onChange={e => setSettings(s => ({...s, startHour: e}))}/>
                </GridItem>
                <GridItem col={6} s={12}>
                  <TimePicker clearLabel={"Clear Time"} label={'End Hour'} step={30} value={settings.endHour} onChange={e => setSettings(s => ({...s, endHour: e}))}/>
                </GridItem>
              </Grid>

              <Stack spacing={3}>
                <Select label={'Default View'} onChange={e => setSettings(s => ({...s, defaultView: e}))} value={settings.defaultView}>
                  <Option value={'Month'}>Month View</Option>
                  <Option value={'Week'}>Week View</Option>
                  <Option value={'Day'}>Day View</Option>
                </Select>
                <ToggleInput
                  label={'Month View'}
                  checked={settings.monthView}
                  offLabel='Disabled'
                  onLabel='Enabled'
                  onChange={e => {
                    setSettings(s => ({
                      ...s,
                      monthView: e.target.checked,
                    }));
                  }}
                />
                <ToggleInput
                  label={'Week View'}
                  checked={settings.weekView}
                  offLabel='Disabled'
                  onLabel='Enabled'
                  onChange={e => {
                    setSettings(s => ({
                      ...s,
                      weekView: e.target.checked,
                    }));
                  }}
                />
                <ToggleInput
                  label={'Day View'}
                  checked={settings.dayView}
                  offLabel='Disabled'
                  onLabel='Enabled'
                  onChange={e => {
                    setSettings(s => ({
                      ...s,
                      dayView: e.target.checked,
                    }));
                  }}
                />
                <ToggleInput
                  label={'Today Button'}
                  checked={settings.todayButton}
                  offLabel='Disabled'
                  onLabel='Enabled'
                  onChange={e => {
                    setSettings(s => ({
                      ...s,
                      todayButton: e.target.checked,
                    }));
                  }}
                />
              </Stack>
            </Stack>
          </Box>
        </ContentLayout>
      )}
    </>
  );
};

export default Settings;
