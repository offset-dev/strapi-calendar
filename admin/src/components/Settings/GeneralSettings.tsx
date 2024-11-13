import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Grid, Typography } from '@strapi/design-system';
import { Field, SingleSelect, SingleSelectOption, Toggle } from '@strapi/design-system';
import { Struct } from '@strapi/types';

import api from '../../api';
import { getTranslation } from '../../utils/getTranslation';
import { useSettings } from '../../context/Settings';
import { ExtensionType } from '../../../../types';

const GeneralSettings = () => {
  const { formatMessage } = useIntl();
  const { updateField, settings } = useSettings();

  const [collections, setCollections] = useState<Array<Struct.BaseSchema>>([]);
  const [extensions, setExtensions] = useState<Array<ExtensionType>>([]);
  const [fields, setFields] = useState<Array<{ id: string; type: string }>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collectionsRes, extensionsRes] = await Promise.all([
          api.getCollections(),
          api.getExtensions(),
        ]);

        setCollections(collectionsRes.data);
        setExtensions(extensionsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData().catch();
  }, []);

  useEffect(() => {
    if (settings.collection && collections.length) {
      const collection = collections.find((x) => x.uid === settings.collection);
      if (!collection) return;

      const fields = Object.entries(collection.attributes)
        .map((x) => ({
          id: x[0],
          type: x[1].type,
        }))
        .concat(
          extensions.reduce((acc, el) => {
            // TODO: Fix TS error
            // @ts-ignore
            acc.push(...el.startFields, ...el.endFields);
            return acc;
          }, [])
        );

      setFields(fields);
    }
  }, [settings, collections, extensions]);

  return (
    <Grid.Root gap={4}>
      <Grid.Item s={12}>
        <Typography variant="beta">
          {formatMessage({
            id: getTranslation('view.settings.section.general.title'),
            defaultMessage: 'General settings',
          })}
        </Typography>
      </Grid.Item>
      <Grid.Item s={6}>
        <Field.Root style={{ width: '100%' }} required>
          <Field.Label>
            {formatMessage({
              id: getTranslation('view.settings.section.general.collection.label'),
              defaultMessage: 'Choose your collection',
            })}
          </Field.Label>
          <SingleSelect
            onChange={(e: string) => updateField({ collection: e })}
            value={settings.collection}
          >
            {collections.map((x) => (
              <SingleSelectOption key={x.uid} value={x.uid}>
                {x.collectionName}
              </SingleSelectOption>
            ))}
          </SingleSelect>
        </Field.Root>
      </Grid.Item>
      <Grid.Item s={6}>
        <Field.Root style={{ width: '100%' }} required>
          <Field.Label>
            {formatMessage({
              id: getTranslation('view.settings.section.general.title.label'),
              defaultMessage: 'Choose your title field',
            })}
          </Field.Label>
          <SingleSelect
            onChange={(e: string) => updateField({ titleField: e })}
            value={settings.titleField}
          >
            <SingleSelectOption value="">
              {formatMessage({
                id: getTranslation('view.settings.section.general.title.none'),
                defaultMessage: 'No title field',
              })}
            </SingleSelectOption>
            {fields
              .filter((x) => x.type === 'string')
              .map((x) => (
                <SingleSelectOption key={x.id} value={x.id}>
                  {x.id}
                </SingleSelectOption>
              ))}
          </SingleSelect>
        </Field.Root>
      </Grid.Item>

      <Grid.Item col={3} s={12}>
        <Field.Root style={{ width: '100%' }} required>
          <Field.Label>
            {formatMessage({
              id: getTranslation('view.settings.section.general.start.label'),
              defaultMessage: 'Choose your start field',
            })}
          </Field.Label>
          <SingleSelect
            onChange={(e: string) => updateField({ startField: e })}
            value={settings.startField}
          >
            <SingleSelectOption value="">
              {formatMessage({
                id: getTranslation('view.settings.section.general.start.none'),
                defaultMessage: 'No start field',
              })}
            </SingleSelectOption>
            {fields
              .filter((x) => x.type === 'datetime')
              .map((x) => (
                <SingleSelectOption key={x.id} value={x.id}>
                  {x.id}
                </SingleSelectOption>
              ))}
          </SingleSelect>
        </Field.Root>
      </Grid.Item>

      <Grid.Item col={3} s={12}>
        <Field.Root style={{ width: '100%' }}>
          <Field.Label>
            {formatMessage({
              id: getTranslation('view.settings.section.general.end.label'),
              defaultMessage: 'Choose your end field',
            })}
          </Field.Label>
          <SingleSelect
            onChange={(e: string) => updateField({ endField: e })}
            value={settings.endField}
          >
            <SingleSelectOption value="">
              {formatMessage({
                id: getTranslation('view.settings.section.general.end.none'),
                defaultMessage: 'No end field',
              })}
            </SingleSelectOption>
            {fields
              .filter((x) => x.type === 'datetime')
              .map((x) => (
                <SingleSelectOption key={x.id} value={x.id}>
                  {x.id}
                </SingleSelectOption>
              ))}
          </SingleSelect>
        </Field.Root>
      </Grid.Item>

      <Grid.Item col={3} s={12}>
        <Field.Root style={{ width: '100%' }}>
          <Field.Label>
            {formatMessage({
              id: getTranslation('view.settings.section.general.duration.label'),
              defaultMessage: 'Choose your default event duration',
            })}
          </Field.Label>
          <SingleSelect
            onChange={(e: string) => updateField({ defaultDuration: Number(e) })}
            value={settings.defaultDuration}
          >
            <SingleSelectOption value="30">
              {formatMessage({
                id: getTranslation('view.settings.section.general.duration.30m'),
                defaultMessage: '30 Minutes',
              })}
            </SingleSelectOption>
            <SingleSelectOption value="60">
              {formatMessage({
                id: getTranslation('view.settings.section.general.duration.1h'),
                defaultMessage: '1 Hour',
              })}
            </SingleSelectOption>
            <SingleSelectOption value="90">
              {formatMessage({
                id: getTranslation('view.settings.section.general.duration.1.5h'),
                defaultMessage: '1.5 Hours',
              })}
            </SingleSelectOption>
            <SingleSelectOption value="120">
              {formatMessage({
                id: getTranslation('view.settings.section.general.duration.2h'),
                defaultMessage: '2 Hours',
              })}
            </SingleSelectOption>
          </SingleSelect>
        </Field.Root>
      </Grid.Item>

      <Grid.Item col={3} s={12}>
        <Field.Root style={{ width: '100%' }}>
          <Field.Label>
            {formatMessage({
              id: getTranslation('view.settings.section.general.color.label'),
              defaultMessage: 'Choose your color field',
            })}
          </Field.Label>
          <SingleSelect
            onChange={(e: string) => updateField({ colorField: e })}
            value={settings.colorField}
          >
            <SingleSelectOption value="">
              {formatMessage({
                id: getTranslation('view.settings.section.general.color.none'),
                defaultMessage: 'No color field',
              })}
            </SingleSelectOption>
            {fields
              .filter((x) => x.type === 'string')
              .map((x) => (
                <SingleSelectOption key={x.id} value={x.id}>
                  {x.id}
                </SingleSelectOption>
              ))}
          </SingleSelect>
        </Field.Root>
      </Grid.Item>

      <Grid.Item s={12}>
        <Field.Root style={{ minWidth: 300 }}>
          <Field.Label>
            {formatMessage({
              id: getTranslation('view.settings.section.general.drafts.label'),
              defaultMessage: 'Display drafts',
            })}
          </Field.Label>
          <Toggle
            checked={settings.drafts}
            offLabel={formatMessage({
              id: getTranslation('view.settings.section.general.display-drafts.off'),
              defaultMessage: 'Disabled',
            })}
            onLabel={formatMessage({
              id: getTranslation('view.settings.section.general.display-drafts.on'),
              defaultMessage: 'Enabled',
            })}
            onChange={(e: any) => {
              updateField({
                drafts: e.target.checked,
              });
            }}
          />
        </Field.Root>
      </Grid.Item>
    </Grid.Root>
  );
};

export default GeneralSettings;
