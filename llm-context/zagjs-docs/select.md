[Skip to main content](https://zagjs.com/components/react/select#skip-nav)

[Go to Zag homepage](https://zagjs.com/) 1.0

[View Zag.js on Github](https://github.com/chakra-ui/zag) [Join the Discord server](https://zagjs.com/discord)
Switch to dark mode

Menu

Quick search...⌘K

Framework:ReactSolidVueSvelte

# Select

A Select component allows users pick a value from predefined options.

[1.8.2 (latest)](https://www.npmjs.com/package/@zag-js/select) [Visualize Logic](https://zag-visualizer.vercel.app/select) [View Source](https://github.com/chakra-ui/zag/tree/main/packages/machines/select)

Stackblitz

Label

Select option

Properties

loopFocus

disabled

readOnly

**Features**

- Support for selecting a single or multiple option
- Keyboard support for opening the listbox using the arrow keys, including
automatically focusing the first or last item.
- Support for looping keyboard navigation.
- Support for selecting an item on blur.
- Typeahead to allow selecting options by typing text, even without opening the
listbox
- Support for Right to Left direction.

## Installation

To use the select machine in your project, run the following command in your
command line:

React

Solid

Vue

Svelte

```

npm install @zag-js/select @zag-js/react
# or
yarn add @zag-js/select @zag-js/react

```

Copy

```

npm install @zag-js/select @zag-js/solid
# or
yarn add @zag-js/select @zag-js/solid

```

Copy

```

npm install @zag-js/select @zag-js/vue
# or
yarn add @zag-js/select @zag-js/vue

```

Copy

```

npm install @zag-js/select @zag-js/svelte
# or
yarn add @zag-js/select @zag-js/svelte

```

Copy

This command will install the framework agnostic menu logic and the reactive
utilities for your framework of choice.

## Anatomy

To set up the select correctly, you'll need to understand its anatomy and how we
name its parts.

> Each part includes a `data-part` attribute to help identify them in the DOM.

## Usage

First, import the select package into your project

```

import * as select from "@zag-js/select"

```

The select package exports these functions:

- `machine` — The state machine logic for the select.
- `connect` — The function that translates the machine's state to JSX attributes
and event handlers.
- `collection` \- The function that creates a
[collection interface](https://zagjs.com/overview/collection) from an array of items.

> You'll need to provide a unique `id` to the `useMachine` hook. This is used to
> ensure that every part has a unique identifier.

Next, import the required hooks and functions for your framework and use the
select machine in your project 🔥

React

Solid

Vue

Svelte

```

import * as select from "@zag-js/select"
import { useMachine, normalizeProps, Portal } from "@zag-js/react"
import { useId, useRef } from "react"

const selectData = [\
  { label: "Nigeria", value: "NG" },\
  { label: "Japan", value: "JP" },\
  { label: "Korea", value: "KO" },\
  { label: "Kenya", value: "KE" },\
  { label: "United Kingdom", value: "UK" },\
  { label: "Ghana", value: "GH" },\
  { label: "Uganda", value: "UG" },\
]

export function Select() {
  const collection = select.collection({
    items: selectData,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
  })

  const service = useMachine(select.machine, {
    id: useId(),
    collection,
  })

  const api = select.connect(service, normalizeProps)

  return (
    <div {...api.getRootProps()}>
      <div {...api.getControlProps()}>
        <label {...api.getLabelProps()}>Label</label>
        <button {...api.getTriggerProps()}>
          {api.valueAsString || "Select option"}
        </button>
      </div>

      <Portal>
        <div {...api.getPositionerProps()}>
          <ul {...api.getContentProps()}>
            {selectData.map((item) => (
              <li key={item.value} {...api.getItemProps({ item })}>
                <span>{item.label}</span>
                <span {...api.getItemIndicatorProps({ item })}>✓</span>
              </li>
            ))}
          </ul>
        </div>
      </Portal>
    </div>
  )
}

```

Copy

```

import * as select from "@zag-js/select"
import { normalizeProps, useMachine } from "@zag-js/solid"
import { createMemo, createUniqueId } from "solid-js"

const selectData = [\
  { label: "Nigeria", value: "NG" },\
  { label: "Japan", value: "JP" },\
  //...\
]

export function Select() {
  const service = useMachine(select.machine, {
    id: createUniqueId(),
    collection: select.collection({
      items: selectData,
    }),
  })

  const api = createMemo(() => select.connect(service, normalizeProps))

  return (
    <div>
      <div>
        <label {...api().getLabelProps()}>Label</label>
        <button {...api().getTriggerProps()}>
          <span>{api().valueAsString || "Select option"}</span>
        </button>
      </div>

      <div {...api().getPositionerProps()}>
        <ul {...api().getContentProps()}>
          {selectData.map((item) => (
            <li key={item.value} {...api().getItemProps({ item })}>
              <span>{item.label}</span>
              <span {...api().getItemIndicatorProps({ item })}>✓</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

```

Copy

```

<script setup>
  import * as select from "@zag-js/select"
  import { normalizeProps, useMachine } from "@zag-js/vue"
  import { computed, defineComponent, Teleport } from "vue"

  const selectData = [\
    { label: "Nigeria", value: "NG" },\
    { label: "Japan", value: "JP" },\
    //...\
  ]

  const service = useMachine(select.machine, {
    id: "1",
    collection: select.collection({
      items: selectData,
    }),
  })

  const api = computed(() => select.connect(service, normalizeProps))
</script>

<template>
  <div>
    <label v-bind="api.getLabelProps()">Label</label>
    <button v-bind="api.getTriggerProps()">
      <span>{{ api.valueAsString || "Select option" }}</span>
      <span>▼</span>
    </button>
  </div>

  <Teleport to="body">
    <div v-bind="api.getPositionerProps()">
      <ul v-bind="api.getContentProps()">
        <li
          v-for="item in selectData"
          :key="item.value"
          v-bind="api.getItemProps({ item })"
        >
          <span>{{ item.label }}</span>
          <span v-bind="api.getItemIndicatorProps({ item })">✓</span>
        </li>
      </ul>
    </div>
  </Teleport>
</template>

```

Copy

```

<script lang="ts">
  import * as select from "@zag-js/select"
  import { portal, useMachine, normalizeProps } from "@zag-js/svelte"

  const selectData = [\
    { label: "Nigeria", value: "NG" },\
    { label: "Japan", value: "JP" },\
    { label: "Korea", value: "KO" },\
    { label: "Kenya", value: "KE" },\
    { label: "United Kingdom", value: "UK" },\
    { label: "Ghana", value: "GH" },\
    { label: "Uganda", value: "UG" },\
  ]

  const collection = select.collection({
    items: selectData,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
  })

  const id = $props.id()
  const service = useMachine(select.machine, {
    id,
    collection,
  })
  const api = $derived(select.connect(service, normalizeProps))
</script>

<div {...api.getRootProps()}>
  <div {...api.getControlProps()}>
    <label {...api.getLabelProps()}>Label</label>
    <button {...api.getTriggerProps()}>
      {api.valueAsString || "Select option"}
    </button>
  </div>

  <div use:portal {...api.getPositionerProps()}>
    <ul {...api.getContentProps()}>
      {#each selectData as item}
        <li {...api.getItemProps({ item })}>
          <span {...api.getItemTextProps({ item })}>{item.label}</span>
          <span {...api.getItemIndicatorProps({ item })}>✓</span>
        </li>
      {/each}
    </ul>
  </div>
</div>

```

Copy

## Setting the initial value

To set the initial value of the select, pass the `value` property to the select
machine's context.

> The `value` property must be an array of strings. If selecting a single value,
> pass an array with a single string.

```

const collection = select.collection({
  items: [\
    { label: "Nigeria", value: "ng" },\
    { label: "Ghana", value: "gh" },\
    { label: "Kenya", value: "ke" },\
    //...\
  ],
})

const service = useMachine(select.machine, {
  id: useId(),
  collection,
  defaultValue: ["ng"],
})

```

## Selecting multiple values

To allow selecting multiple values, set the `multiple` property in the machine's
context to `true`.

```

const service = useMachine(select.machine, {
  id: useId(),
  collection,
  multiple: true,
})

```

## Using a custom object format

By default, the select collection expects an array of items with `label` and
`value` properties. To use a custom object format, pass the `itemToString` and
`itemToValue` properties to the collection function.

- `itemToString` — A function that returns the string representation of an item.
Used to compare items when filtering.
- `itemToValue` — A function that returns the unique value of an item.
- `itemToDisabled` — A function that returns the disabled state of an item.

```

const collection = select.collection({
  // custom object format
  items: [\
    { id: 1, fruit: "Banana", available: true, quantity: 10 },\
    { id: 2, fruit: "Apple", available: false, quantity: 5 },\
    { id: 3, fruit: "Orange", available: true, quantity: 3 },\
    //...\
  ],
  // convert item to string
  itemToString(item) {
    return item.fruit
  },
  // convert item to value
  itemToValue(item) {
    return item.id
  },
  // convert item to disabled state
  itemToDisabled(item) {
    return !item.available || item.quantity === 0
  },
})

// use the collection
const service = useMachine(select.machine, {
  id: useId(),
  collection,
})

```

## Usage within a form

To use select within a form, you'll need to:

- Pass the `name` property to the select machine's context
- Render a hidden `select` element using `api.getSelectProps()`

React

Solid

Vue

Svelte

```

import * as select from "@zag-js/select"
import { useMachine, normalizeProps, Portal } from "@zag-js/react"
import { useId } from "react"

const selectData = [\
  { label: "Nigeria", value: "NG" },\
  { label: "Japan", value: "JP" },\
  { label: "Korea", value: "KO" },\
  { label: "Kenya", value: "KE" },\
  { label: "United Kingdom", value: "UK" },\
  { label: "Ghana", value: "GH" },\
  { label: "Uganda", value: "UG" },\
]

export function SelectWithForm() {
  const service = useMachine(select.machine, {
    id: useId(),
    collection: select.collection({ items: selectData }),
    name: "country",
  })

  const api = select.connect(service, normalizeProps)

  return (
    <form>
      {/* Hidden select */}
      <select {...api.getHiddenSelectProps()}>
        {selectData.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Custom Select */}
      <div {...api.getControlProps()}>
        <label {...api.getLabelProps()}>Label</label>
        <button type="button" {...api.getTriggerProps()}>
          <span>{api.valueAsString || "Select option"}</span>
          <CaretIcon />
        </button>
      </div>

      <Portal>
        <div {...api.getPositionerProps()}>
          <ul {...api.getContentProps()}>
            {selectData.map((item) => (
              <li key={item.value} {...api.getItemProps({ item })}>
                <span>{item.label}</span>
                <span {...api.getItemIndicatorProps({ item })}>✓</span>
              </li>
            ))}
          </ul>
        </div>
      </Portal>
    </form>
  )
}

```

Copy

```

import * as select from "@zag-js/select"
import { normalizeProps, useMachine } from "@zag-js/solid"
import { createMemo, createUniqueId } from "solid-js"

const selectData = [\
  { label: "Nigeria", value: "NG" },\
  { label: "Japan", value: "JP" },\
  //...\
]

export function SelectWithForm() {
  const service = useMachine(
    select.machine, ({
      collection: select.collection({
        items: selectData,
      }),
      id: createUniqueId(),
      name: "country",
    }),
  )Ø

  const api = createMemo(() => select.connect(service, normalizeProps))

  return (
    <form>
      <div {...api().getRootProps()}>
        {/* Hidden select */}
        <select {...api().getHiddenSelectProps()}>
          {selectData.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        {/* Custom Select */}
        <div {...api().getControlProps()}>
          <label {...api().getLabelProps()}>Label</label>
          <button type="button" {...api().getTriggerProps()}>
            <span>{api().valueAsString || "Select option"}</span>
            <CaretIcon />
          </button>
        </div>

        <Portal>
          <div {...api().getPositionerProps()}>
            <ul {...api().getContentProps()}>
              {selectData.map((item) => (
                <li key={item.value} {...api().getItemProps({ item })}>
                  <span>{item.label}</span>
                  <span {...api().getItemIndicatorProps({ item })}>✓</span>
                </li>
              ))}
            </ul>
          </div>
        </Portal>
      </div>
    </form>
  )
}

```

Copy

```

<script setup>
  import * as select from "@zag-js/select"
  import { normalizeProps, useMachine } from "@zag-js/vue"
  import { Teleport } from "vue"

  const selectData = [\
    { label: "Nigeria", value: "NG" },\
    { label: "Japan", value: "JP" },\
    //...\
  ]

  const service = useMachine(select.machine, {
    id: "1",
    collection: select.collection({
      items: selectData,
    }),
    name: "country",
  })

  const api = computed(() => select.connect(service, normalizeProps))
</script>
<template>
  <form>
    <!-- Hidden select  -->
    <select v-bind="api.getHiddenSelectProps()">
      <option v-for="item in selectData" :key="item.value" :value="item.value">
        {{ item.label }}
      </option>
    </select>

    <!-- Custom Select  -->
    <div v-bind="api.getControlProps()">
      <label v-bind="api.getLabelProps()">Label</label>
      <button type="button" v-bind="api.getTriggerProps()">
        <span>{{ api.valueAsString || "Select option" }}</span>
        <span>▼</span>
      </button>
    </div>

    <Teleport to="body">
      <div v-bind="api.getPositionerProps()">
        <ul v-bind="api.getContentProps()">
          <li
            v-for="item in selectData"
            :key="item.value"
            v-bind="api.getItemProps({ item })"
          >
            <span>{{ label }}</span>
            <span v-bind="api.getItemIndicatorProps({ item })">✓</span>
          </li>
        </ul>
      </div>
    </Teleport>
  </form>
</template>

```

Copy

```

<script lang="ts">
  import * as select from "@zag-js/select"
  import { portal, normalizeProps, useMachine } from "@zag-js/svelte"

  const selectData = [\
    { label: "Nigeria", value: "NG" },\
    { label: "Japan", value: "JP" },\
    { label: "Korea", value: "KO" },\
    { label: "Kenya", value: "KE" },\
    { label: "United Kingdom", value: "UK" },\
    { label: "Ghana", value: "GH" },\
    { label: "Uganda", value: "UG" },\
  ]

  const service = useMachine(select.machine, {
    id: "1",
    collection: select.collection({ items: selectData }),
    name: "country",
  })

  const api = $derived(select.connect(service, normalizeProps))
</script>

<form>
  <!-- Hidden select -->
  <select {...api.getHiddenSelectProps()}>
    {#each selectData as option}
      <option value={option.value}>
        {option.label}
      </option>
    {/each}
  </select>

  <!-- Custom Select -->

<div {...api.getControlProps()}>
  <label {...api.getLabelProps()}>Label</label>
  <button type="button" {...api.getTriggerProps()}>
    <span>{api.valueAsString || "Select option"}</span>
    <CaretIcon />
  </button>
</div>

  <div use:portal {...api.getPositionerProps()}>
    <ul {...api.getContentProps()}>
      {#each selectData as item}
        <li {...api.getItemProps({ item })}>
          <span>{item.label}</span>
          <span {...api.getItemIndicatorProps({ item })}>✓</span>
        </li>
      {/each}
    </ul>
  </div>
</form>

```

Copy

## Disabling the select

To disable the select, set the `disabled` property in the machine's context to
`true`.

```

const service = useMachine(select.machine, {
  id: useId(),
  collection,
  disabled: true,
})

```

## Disabling an item

To make a combobox option disabled, pass the `isItemDisabled` property to the
collection function.

```

const collection = select.collection({
  items: countries,
  isItemDisabled(item) {
    return item.disabled
  },
})

const service = useMachine(select.machine, {
  id: useId(),
  collection,
})

```

## Close on select

This behaviour ensures that the menu is closed when an item is selected and is
`true` by default. It's only concerned with when an item is selected with
pointer, space key or enter key. To disable the behaviour, set the
`closeOnSelect` property in the machine's context to `false`.

```

const service = useMachine(select.machine, {
  id: useId(),
  collection,
  closeOnSelect: false,
})

```

## Looping the keyboard navigation

When navigating with the select using the arrow down and up keys, the select
stops at the first and last options. If you need want the navigation to loop
back to the first or last option, set the `loop: true` in the machine's context.

```

const service = useMachine(select.machine, {
  id: useId(),
  collection,
  loop: true,
})

```

## Listening for highlight changes

When an item is highlighted with the pointer or keyboard, use the
`onHighlightChange` to listen for the change and do something with it.

```

const service = useMachine(select.machine, {
  id: useId(),
  onHighlightChange(details) {
    // details => { highlightedValue: string | null, highlightedItem: CollectionItem | null }
    console.log(details)
  },
})

```

## Listening for selection changes

When an item is selected, use the `onValueChange` property to listen for the
change and do something with it.

```

const service = useMachine(select.machine, {
  id: useId(),
  collection,
  onValueChange(details) {
    // details => { value: string[], items: Item[] }
    console.log(details)
  },
})

```

## Listening for open and close events

When the select is opened or closed, the `onOpenChange` callback is called. You
can listen for these events and do something with it.

```

const service = useMachine(select.machine, {
  id: useId(),
  collection,
  onOpenChange(details) {
    // details => { open: boolean }
    console.log("Select opened")
  },
})

```

## Usage with large data

Combine the select machine with the virtualization library like `react-window`
or `@tanstack/react-virtual` to handle large data.

Here's an example using `@tanstack/react-virtual`:

```

function Demo() {
  const selectData = []

  const contentRef = useRef(null)

  const rowVirtualizer = useVirtualizer({
    count: selectData.length,
    getScrollElement: () => contentRef.current,
    estimateSize: () => 32,
  })

  const service = useMachine(select.machine, {
    id: useId(),
    collection,
    scrollToIndexFn(details) {
      rowVirtualizer.scrollToIndex(details.index, {
        align: "center",
        behavior: "auto",
      })
    },
  })

  const api = select.connect(service, normalizeProps)

  return (
    <div {...api.getRootProps()}>
      {/* ... */}
      <Portal>
        <div {...api.getPositionerProps()}>
          <div ref={contentRef} {...api.getContentProps()}>
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                const item = selectData[virtualItem.index]
                return (
                  <div
                    key={item.value}
                    {...api.getItemProps({ item })}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <span>{item.label}</span>
                    <span {...api.getItemIndicatorProps({ item })}>✓</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Portal>
    </div>
  )
}

```

## Usage within dialog

When using the select within a dialog, avoid rendering the select in a `Portal`
or `Teleport`. This is because the dialog will trap focus within it, and the
select will be rendered outside the dialog.

## Styling guide

Earlier, we mentioned that each select part has a `data-part` attribute added to
them to select and style them in the DOM.

### Open and closed state

When the select is open, the trigger and content is given a `data-state`
attribute.

```

[data-part="trigger"][data-state="open|closed"] {
  /* styles for open or closed state */
}

[data-part="content"][data-state="open|closed"] {
  /* styles for open or closed state */
}

```

### Selected state

Items are given a `data-state` attribute, indicating whether they are selected.

```

[data-part="item"][data-state="checked|unchecked"] {
  /* styles for selected or unselected state */
}

```

### Highlighted state

When an item is highlighted, via keyboard navigation or pointer, it is given a
`data-highlighted` attribute.

```

[data-part="item"][data-highlighted] {
  /* styles for highlighted state */
}

```

### Invalid state

When the select is invalid, the label and trigger is given a `data-invalid`
attribute.

```

[data-part="label"][data-invalid] {
  /* styles for invalid state */
}

[data-part="trigger"][data-invalid] {
  /* styles for invalid state */
}

```

### Disabled state

When the select is disabled, the trigger and label is given a `data-disabled`
attribute.

```

[data-part="trigger"][data-disabled] {
  /* styles for disabled select state */
}

[data-part="label"][data-disabled] {
  /* styles for disabled label state */
}

[data-part="item"][data-disabled] {
  /* styles for disabled option state */
}

```

> Optionally, when an item is disabled, it is given a `data-disabled` attribute.

### Empty state

When no option is selected, the trigger is given a `data-placeholder-shown`
attribute.

```

[data-part="trigger"][data-placeholder-shown] {
  /* styles for empty select state */
}

```

## Methods and Properties

### Machine Context

The select machine exposes the following context properties:

- `collection` `ListCollection<T>` The item collection

- `ids` `Partial<{ root: string; content: string; control: string; trigger: string; clearTrigger: string; label: string; hiddenSelect: string; positioner: string; item(id: string | number): string; itemGroup(id: string | number): string; itemGroupLabel(id: string | number): string; }>` The ids of the elements in the select. Useful for composition.

- `name` `string` The \`name\` attribute of the underlying select.

- `form` `string` The associate form of the underlying select.

- `disabled` `boolean` Whether the select is disabled

- `invalid` `boolean` Whether the select is invalid

- `readOnly` `boolean` Whether the select is read-only

- `required` `boolean` Whether the select is required

- `closeOnSelect` `boolean` Whether the select should close after an item is selected

- `onHighlightChange` `(details: HighlightChangeDetails<T>) => void` The callback fired when the highlighted item changes.

- `onValueChange` `(details: ValueChangeDetails<T>) => void` The callback fired when the selected item changes.

- `onOpenChange` `(details: OpenChangeDetails) => void` Function called when the popup is opened

- `positioning` `PositioningOptions` The positioning options of the menu.

- `value` `string[]` The controlled keys of the selected items

- `defaultValue` `string[]` The initial default value of the select when rendered.
Use when you don't need to control the value of the select.

- `highlightedValue` `string` The controlled key of the highlighted item

- `defaultHighlightedValue` `string` The initial value of the highlighted item when opened.
Use when you don't need to control the highlighted value of the select.

- `loopFocus` `boolean` Whether to loop the keyboard navigation through the options

- `multiple` `boolean` Whether to allow multiple selection

- `open` `boolean` Whether the select menu is open

- `defaultOpen` `boolean` Whether the select's open state is controlled by the user

- `scrollToIndexFn` `(details: ScrollToIndexDetails) => void` Function to scroll to a specific index

- `composite` `boolean` Whether the select is a composed with other composite widgets like tabs or combobox

- `deselectable` `boolean` Whether the value can be cleared by clicking the selected item.

\*\*Note:\*\* this is only applicable for single selection

- `dir` `"ltr" | "rtl"` The document's text/writing direction.

- `id` `string` The unique identifier of the machine.

- `getRootNode` `() => ShadowRoot | Node | Document` A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.

- `onPointerDownOutside` `(event: PointerDownOutsideEvent) => void` Function called when the pointer is pressed down outside the component

- `onFocusOutside` `(event: FocusOutsideEvent) => void` Function called when the focus is moved outside the component

- `onInteractOutside` `(event: InteractOutsideEvent) => void` Function called when an interaction happens outside the component

### Machine API

The select `api` exposes the following methods:

- `focused` `boolean` Whether the select is focused

- `open` `boolean` Whether the select is open

- `empty` `boolean` Whether the select value is empty

- `highlightedValue` `string` The value of the highlighted item

- `highlightedItem` `V` The highlighted item

- `highlightValue` `(value: string) => void` Function to highlight a value

- `selectedItems` `V[]` The selected items

- `hasSelectedItems` `boolean` Whether there's a selected option

- `value` `string[]` The selected item keys

- `valueAsString` `string` The string representation of the selected items

- `selectValue` `(value: string) => void` Function to select a value

- `selectAll` `() => void` Function to select all values

- `setValue` `(value: string[]) => void` Function to set the value of the select

- `clearValue` `(value?: string) => void` Function to clear the value of the select.
If a value is provided, it will only clear that value, otherwise, it will clear all values.

- `focus` `() => void` Function to focus on the select input

- `getItemState` `(props: ItemProps<any>) => ItemState` Returns the state of a select item

- `setOpen` `(open: boolean) => void` Function to open or close the select

- `collection` `ListCollection<V>` Function to toggle the select

- `reposition` `(options?: Partial<PositioningOptions>) => void` Function to set the positioning options of the select

- `multiple` `boolean` Whether the select allows multiple selections

- `disabled` `boolean` Whether the select is disabled

### Data Attributes

Root

`data-scope`

select

`data-part`

root

`data-invalid`

Present when invalid

`data-readonly`

Present when read-only

Label

`data-scope`

select

`data-part`

label

`data-disabled`

Present when disabled

`data-invalid`

Present when invalid

`data-readonly`

Present when read-only

Control

`data-scope`

select

`data-part`

control

`data-state`

"open" \| "closed"

`data-focus`

Present when focused

`data-disabled`

Present when disabled

`data-invalid`

Present when invalid

ValueText

`data-scope`

select

`data-part`

value-text

`data-disabled`

Present when disabled

`data-invalid`

Present when invalid

`data-focus`

Present when focused

Trigger

`data-scope`

select

`data-part`

trigger

`data-state`

"open" \| "closed"

`data-disabled`

Present when disabled

`data-invalid`

Present when invalid

`data-readonly`

Present when read-only

`data-placement`

The placement of the trigger

`data-placeholder-shown`

Present when placeholder is shown

Indicator

`data-scope`

select

`data-part`

indicator

`data-state`

"open" \| "closed"

`data-disabled`

Present when disabled

`data-invalid`

Present when invalid

`data-readonly`

Present when read-only

Item

`data-scope`

select

`data-part`

item

`data-value`

The value of the item

`data-state`

"checked" \| "unchecked"

`data-highlighted`

Present when highlighted

`data-disabled`

Present when disabled

ItemText

`data-scope`

select

`data-part`

item-text

`data-state`

"checked" \| "unchecked"

`data-disabled`

Present when disabled

`data-highlighted`

Present when highlighted

ItemIndicator

`data-scope`

select

`data-part`

item-indicator

`data-state`

"checked" \| "unchecked"

ItemGroup

`data-scope`

select

`data-part`

item-group

`data-disabled`

Present when disabled

ClearTrigger

`data-scope`

select

`data-part`

clear-trigger

`data-invalid`

Present when invalid

Content

`data-scope`

select

`data-part`

content

`data-state`

"open" \| "closed"

`data-placement`

The placement of the content

## Accessibility

Adheres to the
[ListBox WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox).

### Keyboard Interactions

- `Space`

When focus is on trigger, opens the select and focuses the first selected item.

When focus is on the content, selects the highlighted item.


- `Enter`

When focus is on trigger, opens the select and focuses the first selected item.

When focus is on content, selects the focused item.


- `ArrowDown`

When focus is on trigger, opens the select.

When focus is on content, moves focus to the next item.


- `ArrowUp`

When focus is on trigger, opens the select.

When focus is on content, moves focus to the previous item.


- `Esc`

Closes the select and moves focus to trigger.


- `A-Z`  `a-z`

When focus is on trigger, selects the item whose label starts with the typed character.

When focus is on the listbox, moves focus to the next item with a label that starts with the typed character.


[Edit this page on GitHub](https://github.com/chakra-ui/zag/edit/main/website/data/components/select.mdx)

##### On this page

- [Installation](https://zagjs.com/components/react/select#installation)
- [Anatomy](https://zagjs.com/components/react/select#anatomy)
- [Usage](https://zagjs.com/components/react/select#usage)
- [Setting the initial value](https://zagjs.com/components/react/select#setting-the-initial-value)
- [Selecting multiple values](https://zagjs.com/components/react/select#selecting-multiple-values)
- [Using a custom object format](https://zagjs.com/components/react/select#using-a-custom-object-format)
- [Usage within a form](https://zagjs.com/components/react/select#usage-within-a-form)
- [Disabling the select](https://zagjs.com/components/react/select#disabling-the-select)
- [Disabling an item](https://zagjs.com/components/react/select#disabling-an-item)
- [Close on select](https://zagjs.com/components/react/select#close-on-select)
- [Looping the keyboard navigation](https://zagjs.com/components/react/select#looping-the-keyboard-navigation)
- [Listening for highlight changes](https://zagjs.com/components/react/select#listening-for-highlight-changes)
- [Listening for selection changes](https://zagjs.com/components/react/select#listening-for-selection-changes)
- [Listening for open and close events](https://zagjs.com/components/react/select#listening-for-open-and-close-events)
- [Usage with large data](https://zagjs.com/components/react/select#usage-with-large-data)
- [Usage within dialog](https://zagjs.com/components/react/select#usage-within-dialog)
- [Styling guide](https://zagjs.com/components/react/select#styling-guide)
- [—Open and closed state](https://zagjs.com/components/react/select#open-and-closed-state)
- [—Selected state](https://zagjs.com/components/react/select#selected-state)
- [—Highlighted state](https://zagjs.com/components/react/select#highlighted-state)
- [—Invalid state](https://zagjs.com/components/react/select#invalid-state)
- [—Disabled state](https://zagjs.com/components/react/select#disabled-state)
- [—Empty state](https://zagjs.com/components/react/select#empty-state)
- [Methods and Properties](https://zagjs.com/components/react/select#methods-and-properties)
- [—Machine Context](https://zagjs.com/components/react/select#machine-context)
- [—Machine API](https://zagjs.com/components/react/select#machine-api)
- [—Data Attributes](https://zagjs.com/components/react/select#data-attributes)
- [Accessibility](https://zagjs.com/components/react/select#accessibility)
- [—Keyboard Interactions](https://zagjs.com/components/react/select#keyboard-interactions)

- Nigeria
- Japan
- Korea
- Kenya
- United Kingdom
