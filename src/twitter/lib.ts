/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
type Props = {
  path: string;
  method: GoogleAppsScript.URL_Fetch.HttpMethod;
  params: Extract<
    GoogleAppsScript.URL_Fetch.Payload,
    { [key: string]: string }
  >;
};
export const twitterApi = ({ path, method, params }: Props) => {
  const baseUrl = `https://api.twitter.com/2/${path}`;
  const url = method === 'get' ? buildUrl_(baseUrl, params) : baseUrl;
  const headers = {
    'Authorization':
      'Bearer ' +
      PropertiesService.getScriptProperties().getProperty(
        'TWITTER_BEARER_TOKEN'
      ),
    'Content-Type': 'application/json',
  };
  const options = {
    method,
    headers,
    ...(method !== 'get' && { ...{ payload: JSON.stringify(params) } }),
  };
  const response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
};

/**
 * Builds a complete URL from a base URL and a map of URL parameters.
 * @param {string} url The base URL.
 * @param {Object.<string, string>} params The URL parameters and values.
 * @return {string} The complete URL.
 * @private
 *
 * Copied from https://github.com/googleworkspace/apps-script-oauth2/blob/ade8b9a8c5e8117ea18bcd14fcd1bb779a3425f8/src/Utilities.js#L20-L48
 */
const buildUrl_ = (url: string, params: { [key: string]: string }) => {
  const paramString = Object.keys(params)
    .map(key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    })
    .join('&');
  return url + (url.indexOf('?') >= 0 ? '&' : '?') + paramString;
};
