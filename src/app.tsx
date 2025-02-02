// @deno-types="npm:@types/react"
import React from 'react';
import { useDBReady, useItem } from '@goatdb/goatdb/react';
import { kSchemeUISettings } from '../schema.ts';

export function Contents() {
  const userId = 'TestUserId';
  const uiSettings = useItem('user', userId, 'UISettings');
  if (uiSettings.schema.ns === null) {
    uiSettings.schema = kSchemeUISettings;
  }
  return <div>Content goes here</div>;
}

export function App() {
  const ready = useDBReady();

  if (ready === 'loading') {
    return <div>Loading...</div>;
  }
  if (ready === 'error') {
    return <div>Error! Please reload the page.</div>;
  }

  return <Contents />;
}
