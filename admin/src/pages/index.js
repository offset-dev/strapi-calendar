/*
 *
 * HomePage
 *
 */

import React, {memo, useState} from "react";

import api from "../api";

import {EmptyStateLayout} from "@strapi/design-system/EmptyStateLayout";
import {BaseHeaderLayout, ContentLayout} from "@strapi/design-system/Layout";
import {LinkButton} from "@strapi/design-system/LinkButton";
import {Icon} from "@strapi/design-system/Icon";
import Calendar from "@strapi/icons/Calendar";
import Cog from "@strapi/icons/Cog";

const HomePage = () => {
  const [data, setData] = useState([]);
  const load = date => api.getData(date).then(r => setData(r.data));

  React.useEffect(() => {
    load();
  }, []);

  return (
    <>
      <BaseHeaderLayout title="Calendar" subtitle="Visualize your events" as="h2"/>
      <ContentLayout>
        {data.length === 0 && (
          <EmptyStateLayout icon={<Icon color={"primary700"} width={"30rem"} height={"30rem"} as={Calendar}/>} content={"There are no events loaded. \n\n Did you properly configure the plugin?"} action={
            <LinkButton variant="secondary" to={"/settings/calendar"} startIcon={<Cog/>}>
              Review Settings
            </LinkButton>
          }/>
        )}
      </ContentLayout>
    </>
  );
};

export default memo(HomePage);
