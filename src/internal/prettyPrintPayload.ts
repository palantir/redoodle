/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { isObject } from "./utils/isObject";

const BLUE = "color: blue;";
const RED1 = "color: #A82A2A;";
const INDIGO1 = "color: #5642A6;";
const BLACK = "color: #10161A;";
const GRAY3 = "color: #8A9BA8;";
const FONT_WEIGHT_NORMAL = "font-weight: normal;";
const FONT_STYLE_ITALIC = "font-style: italic;";

const DEFAULT_FORMAT_STYLE = FONT_WEIGHT_NORMAL + FONT_STYLE_ITALIC;

export interface FormatResult {
  formatString: string;
  formatArgs: string[];
  truncated?: boolean;
}

function formatKey(key: string): FormatResult {
  return {
    formatString: "%c%s%c: ",
    formatArgs: [
      DEFAULT_FORMAT_STYLE + INDIGO1,
      key,
      DEFAULT_FORMAT_STYLE + BLACK,
    ],
  };
}

function formatValue(value: any): FormatResult {
  const valueType = typeof value;
  if (isObject(value)) {
    return {
      formatString: "%c%s",
      formatArgs: [
        DEFAULT_FORMAT_STYLE,
        value.constructor.name,
      ],
      truncated: true,
    };
  } else if (Array.isArray(value)) {
    return {
      formatString: "%c%s[%d]",
      formatArgs: [
        DEFAULT_FORMAT_STYLE,
        (value.constructor as any).name,
        value.length,
      ],
      truncated: true,
    };
  } else if (valueType === "boolean" || valueType === "number") {
    return {
      formatString: "%c%s",
      formatArgs: [
        DEFAULT_FORMAT_STYLE + BLUE,
        value,
      ],
    };
  } else if (valueType === "function") {
    return {
      formatString: "%c%s",
      formatArgs: [
        DEFAULT_FORMAT_STYLE + BLACK,
        value,
      ],
    };
  } else if (value == undefined) {
    return {
      formatString: "%c%s",
      formatArgs: [
        DEFAULT_FORMAT_STYLE + GRAY3,
        value,
      ],
    };
  } else {
    return {
      formatString: "%c\"%s\"",
      formatArgs: [
        DEFAULT_FORMAT_STYLE + RED1,
        value,
      ],
    };
  }
}

function pushFormatResult(dst: FormatResult, result: FormatResult) {
  /* Remark: we're modifying the format results in-place to avoid unnecessary array and object allocations */
  dst.formatString += result.formatString;
  dst.formatArgs.push(...result.formatArgs);
  dst.truncated = dst.truncated || result.truncated;
}

const formattedComma: FormatResult = {
  formatString: "%c, ",
  formatArgs: [
    DEFAULT_FORMAT_STYLE + BLACK,
  ],
};

export function prettyPrintPayload(payload: any, maxKeysToPrint: number = 5): FormatResult {
  if (!isObject(payload)) {
    return formatValue(payload);
  }

  const keys = Object.keys(payload);
  const formatResult: FormatResult = {
    formatString: "%cObject {",
    formatArgs: [
      DEFAULT_FORMAT_STYLE + BLACK,
    ],
  };

  let numberOfKeysToPrint = keys.length;
  let isKeyTruncated = false;
  if (keys.length > maxKeysToPrint) {
    formatResult.truncated = true;
    isKeyTruncated = true;
    numberOfKeysToPrint = maxKeysToPrint;
  }

  for (let i = 0; i < numberOfKeysToPrint; i++) {
    const key = keys[i];
    const value = payload[key];
    pushFormatResult(formatResult, formatKey(key));
    pushFormatResult(formatResult, formatValue(value));

    if (i < numberOfKeysToPrint - 1) {
      pushFormatResult(formatResult, formattedComma);
    }
  }

  if (isKeyTruncated) {
    pushFormatResult(formatResult, {
      formatString: "%c…",
      formatArgs: [
        DEFAULT_FORMAT_STYLE + BLACK,
      ],
    });
  }

  pushFormatResult(formatResult, {
    formatString: "%c}",
    formatArgs: [
      DEFAULT_FORMAT_STYLE + BLACK,
    ],
  });

  return formatResult;
}
