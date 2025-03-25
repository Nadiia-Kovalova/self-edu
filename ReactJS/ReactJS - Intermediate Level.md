- [1. What is `useRef`?](#1-what-is-useref)
- [2. What Is `createRef`?](#2-what-is-createref)
- [3. What Is Ref Forwarding?](#3-what-is-ref-forwarding)
- [4. What Happens If You Pass a Ref Object to a Child Component Without `forwardRef`?](#4-what-happens-if-you-pass-a-ref-object-to-a-child-component-without-forwardref)
- [5. What Are Callback Refs?](#5-what-are-callback-refs)
- [6. What Is SyntheticEvent?](#6-what-is-syntheticevent)
- [7. How do `useRef`, `createRef`, ref forwarding, and callback refs work with SyntheticEvent?](#7-how-do-useref-createref-ref-forwarding-and-callback-refs-work-with-syntheticevent)
- [8. How do `useRef`, `createRef`, ref forwarding, callback refs, and SyntheticEvent enhance React DOM?](#8-how-do-useref-createref-ref-forwarding-callback-refs-and-syntheticevent-enhance-react-dom)
- [9. How do controlled and uncontrolled components differ in React forms?](#9-how-do-controlled-and-uncontrolled-components-differ-in-react-forms)
- [10. How does the Context API work in React, and when should you use it instead of Redux?](#10-how-does-the-context-api-work-in-react-and-when-should-you-use-it-instead-of-redux)
- [11. When should you use Context, and how do `useContext`, `Provider`, and `Consumer` work?](#11-when-should-you-use-context-and-how-do-usecontext-provider-and-consumer-work)
- [12. What Is Profiler?](#12-what-is-profiler)
- [13. What is the `useCallback` hook, and how does it prevent unnecessary re-renders?](#13-what-is-the-usecallback-hook-and-how-does-it-prevent-unnecessary-re-renders)
- [14. How does the `useMemo` hook optimize performance, and when should you use it?](#14-how-does-the-usememo-hook-optimize-performance-and-when-should-you-use-it)
- [15. How do `memo`, `useMemo`, `useCallback`, keys, and Profiler optimize performance?](#15-how-do-memo-usememo-usecallback-keys-and-profiler-optimize-performance)
- [16. What is the purpose of keys in React lists, and what happens if they’re missing?](#16-what-is-the-purpose-of-keys-in-react-lists-and-what-happens-if-theyre-missing)
- [17. What is the `React.Children` API, and how can it be used to manipulate child components?](#17-what-is-the-reactchildren-api-and-how-can-it-be-used-to-manipulate-child-components)
- [18. How does React handle automatic batching in React 18, and what’s the benefit?](#18-how-does-react-handle-automatic-batching-in-react-18-and-whats-the-benefit)
- [19. What is the `useId` hook, and how does it improve accessibility?](#19-what-is-the-useid-hook-and-how-does-it-improve-accessibility)
- [20. What is the `useSyncExternalStore` hook, and when would you use it in React?](#20-what-is-the-usesyncexternalstore-hook-and-when-would-you-use-it-in-react)
- [21. What is the `useDebugValue` hook, and how does it enhance debugging?](#21-what-is-the-usedebugvalue-hook-and-how-does-it-enhance-debugging)
- [22. How can you implement a custom `useFetch` hook with abort functionality in React?](#22-how-can-you-implement-a-custom-usefetch-hook-with-abort-functionality-in-react)
- [23. How can you create a custom `useToggle` hook, and what’s its benefit?](#23-how-can-you-create-a-custom-usetoggle-hook-and-whats-its-benefit)
- [24. How do React Redux’s presentational/container components and hooks integrate?](#24-how-do-react-reduxs-presentationalcontainer-components-and-hooks-integrate)
- [25. How does Redux Thunk handle async flow in production?](#25-how-does-redux-thunk-handle-async-flow-in-production)
- [26. How do you configure routing with React Router in a scalable way?](#26-how-do-you-configure-routing-with-react-router-in-a-scalable-way)
- [27. How does React Router v6 handle navigation, and what’s a key improvement over v5?](#27-how-does-react-router-v6-handle-navigation-and-whats-a-key-improvement-over-v5)


Below is a comprehensive set of questions and answers covering React topics across **Intermediate** level.

---

**Intermediate Level**  

---

##  1. <a name='WhatisuseRef'></a>What is `useRef`?

A hook that creates a mutable reference persisting across renders, commonly used to access DOM elements or store values without triggering re-renders.  
**How It Works**: Returns an object with a `current` property, initialized to the value passed (or `null` if none).  
**Examples**:  
```javascript
import { useRef, useEffect } from 'react';

function FocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus(); // Access DOM on mount
  }, []);

  return <input ref={inputRef} placeholder="Type here" />;
}
```
```javascript
function InputTracker() {
  const [value, setValue] = useState('');
  const prevValueRef = useRef('');

  useEffect(() => {
    prevValueRef.current = value; // Store previous value
  }, [value]);

  return (
    <>
      <input value={value} onChange={e => setValue(e.target.value)} />
      <p>Previous: {prevValueRef.current}, Current: {value}</p>
    </>
  );
}
```
- **Use Cases**: DOM manipulation (e.g., focus), storing previous values (e.g., `prevProps`).  
- **Beyond DOM**: Tracks previous state without re-rendering
- **Insight**: I used `useRef` in a form to track unsaved changes without extra renders, optimizing performance.
- **Senior Insight**: In a chat app, I used `useRef` to scroll to the latest message without state-driven re-renders—kept perf lean.

---

##  2. <a name='WhatIscreateRef'></a>What Is `createRef`?

A method to create a ref object, primarily for class components, re-created on every render.  
**How It Works**: Returns a new ref each time, unlike `useRef`’s persistence.  
**Example**:  
```javascript
class OldInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }

  render() {
    return <input ref={this.inputRef} />;
  }
}
```
- **Use Cases**: Legacy class components — rare now.  
- **Senior Insight**: I’ve phased out `createRef` in favor of `useRef` — only see it in old codebases, where it’s a migration target.

---

##  3. <a name='WhatIsRefForwarding'></a>What Is Ref Forwarding?

A technique using `forwardRef` to pass a ref from a parent to a child component, exposing DOM or custom methods.  
**How It Works**: Wraps a component with `forwardRef`, receiving `(props, ref)` as args.  
**Example**:  
```javascript
import { forwardRef, useRef } from 'react';

const CustomInput = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});

function App() {
  const ref = useRef();
  return (
    <>
      <CustomInput ref={ref} />
      <button onClick={() => ref.current.focus()}>Focus</button>
    </>
  );
}
```
- **Use Cases**: Exposing child DOM (e.g., inputs) or imperative APIs (e.g., `play()` on a video).  
- **Senior Insight**: In a form library, I forwarded refs to custom inputs—enabled parent control without breaking encapsulation.

---

##  4. <a name='WhatHappensIfYouPassaRefObjecttoaChildComponentWithoutforwardRef'></a>What Happens If You Pass a Ref Object to a Child Component Without `forwardRef`?

**Short Answer**  
If you pass a `ref` object as a prop to a child component and don’t use `forwardRef`, the ref won’t attach to the child’s DOM element or instance. Instead, it’s treated as a regular prop, and the `ref` object’s `current` property remains `null` (or unchanged). React reserves the `ref` prop for its internal ref-passing mechanism, and without `forwardRef`, the child can’t process it as a ref.

**Detailed Explanation**
In React, the `ref` attribute is a special prop handled by the framework to attach references to DOM nodes or component instances. When you pass a `ref` object (e.g., `{ current: null }`) directly as a prop (e.g., `<Child ref={myRef} />`), here’s what happens:

1. **Ref Isn’t Recognized as a Ref**:  
   - React only forwards refs to children when the child component is explicitly set up to receive them via `forwardRef`. Without it, `ref` is just another prop name, like `className` or `onClick`, and doesn’t trigger React’s ref-attachment logic.

2. **Child Receives It as a Prop**:  
   - The child component sees `ref` as a regular prop in its `props` object (e.g., `props.ref`), but it won’t automatically bind to anything unless the child manually uses it (which isn’t standard).

3. **`ref.current` Stays Null**:  
   - Since React doesn’t forward the ref to a DOM element or instance, the `ref` object’s `current` property doesn’t get updated — it remains `null` (or its initial value).

**Example: Without `forwardRef`**  
```javascript
import { useRef } from 'react';

function Child(props) {
  // props.ref is just a prop, not tied to DOM
  console.log('Child ref prop:', props.ref); // Logs ref object
  return <input />;
}

function Parent() {
  const inputRef = useRef(null);

  useEffect(() => {
    console.log('Ref current:', inputRef.current); // Logs null
  }, []);

  return (
    <>
      <Child ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
    </>
  );
}

export default Parent;
```
- **Output**:  
  - `Child ref prop: { current: null }` (the ref object is passed as a prop).  
  - `Ref current: null` (no DOM attachment).  
- **Result**: Clicking “Focus” does nothing—`inputRef.current` isn’t the `<input>`.

**Example: With `forwardRef`**  
```javascript
import { useRef, forwardRef } from 'react';

const Child = forwardRef((props, ref) => {
  return <input ref={ref} />;
});

function Parent() {
  const inputRef = useRef(null);

  useEffect(() => {
    console.log('Ref current:', inputRef.current); // Logs <input> element
  }, []);

  return (
    <>
      <Child ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </>
  );
}

export default Parent;
```
- **Output**:  
  - `Ref current: [HTMLInputElement]` (ref is attached).  
- **Result**: Clicking “Focus” works—`inputRef.current` is the `<input>`.

**Why This Happens**  
- **React’s Design**: The `ref` prop is reserved for React’s internal ref system. `forwardRef` tells React to pass the parent’s ref to the child’s DOM or instance, bypassing the props object. Without it, React ignores the `ref` prop for ref purposes.  
- **Props vs. Refs**: Props are data; refs are imperative handles. Mixing them without `forwardRef` breaks the ref chain.

**Senior-Level Insights**  
- **Common Pitfall**: I’ve seen devs pass `ref` expecting it to “just work” — leads to silent failures. Always use `forwardRef` for ref passing.  
- **Workaround Without `forwardRef`**: If you can’t modify the child, pass the ref as a custom prop (e.g., `inputRef={myRef}`) and manually attach it in the child — clunky but doable.  
- **Production Tip**: In a design system, I enforce `forwardRef` on all reusable components — avoids ref-related bugs in complex UIs.

---

##  5. <a name='WhatAreCallbackRefs'></a>What Are Callback Refs?

A dynamic way to set refs via a function, called with the DOM node (or null on unmount).  
**How It Works**: Pass a callback to the `ref` prop instead of a ref object.  
**Example**:  
```javascript
function DynamicRef() {
  let inputNode; // Local var, not a ref object

  const setRef = (node) => {
    inputNode = node; // Capture node
    if (node) node.focus();
  };

  return <input ref={setRef} />;
}
```
- **Use Cases**: Conditional ref logic, integrating with non-React code.  
- **Senior Insight**: Used callback refs in a third-party integration (e.g., D3 chart) — offered flexibility over `useRef` for one-off hacks.

---

##  6. <a name='WhatIsSyntheticEvent'></a>What Is SyntheticEvent?

A cross-browser wrapper around native DOM events, normalizing properties and behavior.  
**How It Works**: React creates SyntheticEvent objects for event handlers, pooling them for performance.  
**Example**:  
```javascript
function ClickHandler() {
  const handleClick = (event) => {
    console.log(event.type); // 'click'
    console.log(event.target); // DOM element
    event.preventDefault(); // Normalized
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```
- **Details**: Properties like `target`, `preventDefault` work consistently — native quirks (e.g., IE) are abstracted.  
- **Senior Insight**: In a drag-and-drop UI, I relied on SyntheticEvent’s consistency — saved hours of browser-specific fixes. Beware: it’s nullified post-handler unless persisted (e.g., `event.persist()`).

---

##  7. <a name='HowdouseRefcreateRefrefforwardingandcallbackrefsworkwithSyntheticEvent'></a>How do `useRef`, `createRef`, ref forwarding, and callback refs work with SyntheticEvent?

- Refs manage DOM or values;
- SyntheticEvent wraps native events.  
```javascript
function InputWithFocus() {
  const inputRef = useRef(null); // Stable ref
  const setRef = useCallback(node => {
    if (node) node.focus(); // Callback ref
  }, []);

  const handleClick = (e) => {
    console.log(e.type); // SyntheticEvent: 'click'
    inputRef.current.focus();
  };

  return (
    <>
      <input ref={inputRef} />
      <input ref={setRef} />
      <button onClick={handleClick}>Focus</button>
    </>
  );
}

const ForwardedInput = forwardRef((props, ref) => <input ref={ref} />);
```
- **`useRef`**: Persistent, functional components.  
- **`createRef`**: Per-render, class-based (legacy).  
- **Ref Forwarding**: Pass ref to child via `forwardRef`:  
```javascript
const Child = forwardRef((props, ref) => <input ref={ref} />);
```
- **Callback Refs**: Dynamic ref assignment.  
- **Insight**: In a form library, I used forwarded refs with SyntheticEvent for custom inputs — optimized focus management.
- **Insight**: `useRef` is versatile — DOM and values — used it for scroll tracking.

---

##  8. <a name='HowdouseRefcreateRefrefforwardingcallbackrefsandSyntheticEventenhanceReactDOM'></a>How do `useRef`, `createRef`, ref forwarding, callback refs, and SyntheticEvent enhance React DOM?

Refs and events power DOM interaction:  
```javascript
const FancyInput = forwardRef((props, ref) => {
  const localRef = useRef();
  const setRef = useCallback(node => { if (node) node.focus(); }, []);

  const handleMouseDown = (e) => {
    e.preventDefault(); // SyntheticEvent
    ref?.current?.focus();
  };

  return <input ref={ref || localRef} onMouseDown={handleMouseDown} />;
});

function App() {
  const ref = useRef();
  return <FancyInput ref={ref} />;
}
```
- **Insight**: In a drag-drop UI, I mixed forwarded refs with SyntheticEvent—smooth across browsers.

---

##  9. <a name='HowdocontrolledanduncontrolledcomponentsdifferinReactforms'></a>How do controlled and uncontrolled components differ in React forms?

- **Controlled**: State drives value, predictable, , updated via `onChange`.    
```javascript
function ControlledForm() {
  const [value, setValue] = useState('');
  return (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder="Type here"
    />
  );
}
```
- **Uncontrolled**: DOM drives value, accessed via ref, simpler.  
```javascript
function UncontrolledForm() {
  const ref = useRef();
  return (
    <>
      <input ref={ref} />
      <button onClick={() => console.log(ref.current.value)}>Log</button>
    </>
  );
}
```
- **Difference**: Controlled offers full React control (validation, syncing); uncontrolled is simpler but less flexible.  
- **Insight**: In a multi-step form, I used controlled for validation — uncontrolled for file inputs to avoid state bloat.

---

##  10. <a name='HowdoestheContextAPIworkinReactandwhenshouldyouuseitinsteadofRedux'></a>How does the Context API work in React, and when should you use it instead of Redux?

The **Context API** provides a way to share state across components without prop drilling.  
```javascript
const CountContext = React.createContext();
function App() {
  const [count, setCount] = React.useState(0);
  return (
    <CountContext.Provider value={{ count, setCount }}>
      <Counter />
    </CountContext.Provider>
  );
}
function Counter() {
  const { count, setCount } = React.useContext(CountContext);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```
- **vs. Redux**:  
  - **Context**: Lightweight, built-in, good for simple shared state (e.g., themes, user settings).  
  - **Redux**: External, structured, better for complex state with actions/reducers (e.g., multi-user apps).  
- **When**: Use Context for medium-sized apps or specific features; Redux for large-scale, predictable state.  
- **Insight**: I replaced Redux with Context in a small admin panel, simplifying the codebase without sacrificing control.

---

##  11. <a name='WhenshouldyouuseContextandhowdouseContextProviderandConsumerwork'></a>When should you use Context, and how do `useContext`, `Provider`, and `Consumer` work?

Context shares state globally — use for app-wide data (e.g., auth).  
```javascript
const AuthContext = createContext();

function App() {
  const [user, setUser] = useState('Alice');
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Profile />
    </AuthContext.Provider>
  );
}

function Profile() {
  const { user } = useContext(AuthContext);
  return <p>User: {user}</p>;
}

// Consumer (older syntax)
function OldProfile() {
  return <AuthContext.Consumer>{({ user }) => <p>{user}</p>}</AuthContext.Consumer>;
}
```
- **When**: Avoid for frequent updates — re-renders all consumers.
- **When**: Use for app-wide data (e.g., themes) vs. prop drilling.   
- **Insight**: In a SaaS app, I used Context for theming — Redux for user data due to scale.

---

##  12. <a name='WhatIsProfiler'></a>What Is Profiler?

A React component (`React.Profiler`) that measures render performance, logging timing data per render.  
**How It Works**: Wraps a tree, calls an `onRender` callback with metrics (e.g., duration, phase).  
**Example**:  
```javascript
function App() {
  const [count, setCount] = useState(0);

  const onRender = (id, phase, actualDuration) => {
    console.log(`${id} ${phase}: ${actualDuration}ms`);
  };

  return (
    <React.Profiler id="Counter" onRender={onRender}>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </React.Profiler>
  );
}
```
- **Metrics**: `actualDuration` (render time), `phase` (`mount`/`update`).  
- **Senior Insight**: In a dashboard, I used Profiler to pinpoint a slow list render — optimized with `useMemo`, dropping time from 50ms to 5ms.

---

##  13. <a name='WhatistheuseCallbackhookandhowdoesitpreventunnecessaryre-renders'></a>What is the `useCallback` hook, and how does it prevent unnecessary re-renders?

`useCallback` memoizes a function, returning the same instance across renders unless dependencies change, preventing child re-renders.  
```javascript
import { useState, useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => setCount(c => c + 1), []); // Stable reference

  return (
    <>
      <p>Count: {count}</p>
      <Child onIncrement={increment} />
    </>
  );
}

const Child = React.memo(({ onIncrement }) => {
  console.log('Child rendered');
  return <button onClick={onIncrement}>Increment</button>;
});
```
- **Why**: Without `useCallback`, `onIncrement` is a new function each render, triggering `Child` re-renders despite `React.memo`.  
- **Insight**: In a list component, I used `useCallback` for item handlers, cutting child renders by 60% in perf tests.

---

##  14. <a name='HowdoestheuseMemohookoptimizeperformanceandwhenshouldyouuseit'></a>How does the `useMemo` hook optimize performance, and when should you use it?

`useMemo` memoizes expensive computations, recalculating only when dependencies change.  
```javascript
import { useMemo, useState } from 'react';

function ExpensiveList() {
  const [numbers, setNumbers] = useState([1, 2, 3]);
  const [filter, setFilter] = useState('');

  const filteredNumbers = useMemo(() => {
    console.log('Filtering...');
    return numbers.filter(n => n.toString().includes(filter));
  }, [numbers, filter]); // Recalculates if these change

  return (
    <>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <ul>{filteredNumbers.map(n => <li key={n}>{n}</li>)}</ul>
    </>
  );
}
```
- **When**: Use for costly operations (e.g., filtering, sorting) tied to state/props.  
- **Insight**: In a data grid, I memoized a 10k-row sort with `useMemo`, dropping render time from 200ms to 10ms.

---

##  15. <a name='HowdomemouseMemouseCallbackkeysandProfileroptimizeperformance'></a>How do `memo`, `useMemo`, `useCallback`, keys, and Profiler optimize performance?

- **`React.memo`**: Skips re-renders if props are same (shallow comparison). 
- **`useMemo`**: Memoizes values.  
- **`useCallback`**: Memoizes functions.  
```javascript
const Item = React.memo(({ onClick }) => <button onClick={onClick}>Click</button>);

function List() {
  const [items, setItems] = useState([1, 2, 3]);
  const sorted = useMemo(() => items.sort(), [items]);
  const handleClick = useCallback(() => console.log('Clicked'), []);

  return (
    <React.Profiler id="List" onRender={(id, phase, duration) => console.log(`${id}: ${duration}ms`)}>
      {sorted.map(i => <Item key={i} onClick={handleClick} />)}
    </React.Profiler>
  );
}
```
- **Keys**: Optimize list diffing.  
- **Profiler**: Measures render time.  
- **Insight**: In a table UI, I combined these — cut render time by 40% after profiling.

---

##  16. <a name='WhatisthepurposeofkeysinReactlistsandwhathappensiftheyremissing'></a>What is the purpose of keys in React lists, and what happens if they’re missing?

**Keys** uniquely identify elements in a list, helping React optimize reconciliation by tracking which items change, move, or persist.  
```javascript
function ItemList({ items }) {
  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}
```
- **Without Keys**: React uses indices, leading to inefficient updates or bugs (e.g., re-rendering unchanged items).  
```javascript
// Bad: No keys
{items.map(item => <li>{item.name}</li>)} // Index-based, may reorder incorrectly
```
- **Impact**: Missing keys can cause UI glitches (e.g., form inputs swapping) or performance hits.  
- **Insight**: In a dynamic todo app, I fixed flickering by switching from index keys to UUIDs, ensuring stable rendering.

---

##  17. <a name='WhatistheReact.ChildrenAPIandhowcanitbeusedtomanipulatechildcomponents'></a>What is the `React.Children` API, and how can it be used to manipulate child components?

`React.Children` provides utilities to work with `props.children`, useful for mapping or filtering:  
```javascript
function Wrapper({ children }) {
  const enhancedChildren = React.Children.map(children, (child, index) =>
    React.cloneElement(child, { 'data-index': index })
  );
  return <div>{enhancedChildren}</div>;
}

function App() {
  return (
    <Wrapper>
      <p>First</p>
      <p>Second</p>
    </Wrapper>
  );
}
// Renders: <div><p data-index="0">First</p><p data-index="1">Second</p></div>
```
- **Use Case**: Adding props or validating children in reusable wrappers.  
- **Insight**: In a design system, I used `React.Children` to enforce child types in a `Card` component, improving DX.

---

##  18. <a name='HowdoesReacthandleautomaticbatchinginReact18andwhatsthebenefit'></a>How does React handle automatic batching in React 18, and what’s the benefit?

React 18 automatically batches multiple state updates within the same event loop, reducing renders:  
```javascript
function BatchExample() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  const handleClick = () => {
    setCount(c => c + 1);
    setFlag(f => !f); // Batched in React 18
  };

  console.log('Rendered');
  return <button onClick={handleClick}>{count} - {flag.toString()}</button>;
}
```
- **Pre-18**: Separate renders per `setState`.  
- **Benefit**: Fewer renders (one vs. two here), better performance in event handlers or promises.  
- **Insight**: In a form with multiple updates, batching cut renders by 50%, noticeable in perf traces.

---

##  19. <a name='WhatistheuseIdhookandhowdoesitimproveaccessibility'></a>What is the `useId` hook, and how does it improve accessibility?

`useId` (React 18+) generates unique IDs for elements, ensuring consistent client-server rendering and accessibility (e.g., linking labels to inputs).  
```javascript
function FormField() {
  const id = React.useId();
  return (
    <>
      <label htmlFor={id}>Name</label>
      <input id={id} type="text" />
    </>
  );
}
```
- **Why**: Prevents ID collisions in SSR (e.g., Next.js) and ensures screen readers work correctly.  
- **Insight**: In a form-heavy app, I replaced manual ID generation with `useId`, fixing hydration mismatches and boosting a11y compliance.

---

##  20. <a name='WhatistheuseSyncExternalStorehookandwhenwouldyouuseitinReact'></a>What is the `useSyncExternalStore` hook, and when would you use it in React?

`useSyncExternalStore` (React 18) lets React components subscribe to external stores (e.g., browser APIs, third-party state) while ensuring consistent rendering across concurrent updates.  
```javascript
import { useSyncExternalStore } from 'react';

function WindowWidth() {
  const width = useSyncExternalStore(
    (callback) => {
      window.addEventListener('resize', callback);
      return () => window.removeEventListener('resize', callback);
    },
    () => window.innerWidth // Snapshot function
  );
  return <div>Width: {width}px</div>;
}
```
- **When**: Use for integrating non-React state (e.g., `window`, Redux store) without hydration mismatches or tearing in concurrent rendering.  
- **Insight**: In a responsive app, I used it to sync `window.matchMedia` for dark mode, avoiding `useEffect` flicker in SSR.

---

##  21. <a name='WhatistheuseDebugValuehookandhowdoesitenhancedebugging'></a>What is the `useDebugValue` hook, and how does it enhance debugging?

`useDebugValue` labels custom hooks in React DevTools, improving debug visibility.  
```javascript
import { useState, useDebugValue } from 'react';

function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  useDebugValue(`Count: ${count}`); // Shows in DevTools
  return [count, () => setCount(c => c + 1)];
}

function Counter() {
  const [count, increment] = useCounter(0);
  return <button onClick={increment}>{count}</button>;
}
```
- **How**: Pass a value or function to display in DevTools for that hook.  
- **Insight**: In a shared library, I added `useDebugValue` to custom hooks, speeding up team debugging by 20%.

---

##  22. <a name='HowcanyouimplementacustomuseFetchhookwithabortfunctionalityinReact'></a>How can you implement a custom `useFetch` hook with abort functionality in React?

A custom `useFetch` hook can handle data fetching with cancellation using `AbortController`:  
```javascript
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));

    return () => controller.abort(); // Cleanup on unmount or URL change
  }, [url]);

  return { data, loading, error };
}

function FetchComponent() {
  const { data, loading, error } = useFetch('https://api.example.com/data');
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>Data: {data?.message}</div>;
}
```
- **Why Abort**: Prevents race conditions or memory leaks if components unmount before fetch completes.  
- **Insight**: In a search app, I added abort to `useFetch`, cutting stale responses by 100% during rapid input changes.

---

##  23. <a name='HowcanyoucreateacustomuseTogglehookandwhatsitsbenefit'></a>How can you create a custom `useToggle` hook, and what’s its benefit?

A `useToggle` hook encapsulates boolean state toggling:  
```javascript
import { useState } from 'react';

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(v => !v);
  return [value, toggle];
}

function ToggleButton() {
  const [isOn, toggle] = useToggle(false);
  return <button onClick={toggle}>{isOn ? 'On' : 'Off'}</button>;
}
```
- **Benefit**: Reusable, reduces boilerplate for common patterns.  
- **Insight**: I built `useToggle` for modals and accordions in a library, standardizing UI toggles across teams.

---

##  24. <a name='HowdoReactReduxspresentationalcontainercomponentsandhooksintegrate'></a>How do React Redux’s presentational/container components and hooks integrate?

- **Presentational**: UI only, props-driven.   
- **Container**: Logic, Redux-connected.  
```javascript
import { Provider, useSelector, useDispatch } from 'react-redux';
import { createStore } from 'redux';

const reducer = (state = 0, action) => (action.type === 'INC' ? state + 1 : state);
const store = createStore(reducer);

// Presentational
function CounterDisplay({ count, onIncrement }) {
  return <button onClick={onIncrement}>{count}</button>;
}

// Container with hooks
function Counter() {
  const count = useSelector(state => state);
  const dispatch = useDispatch();
  return <CounterDisplay count={count} onIncrement={() => dispatch({ type: 'INC' })} />;
}

function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}
```
- **Insight**: I’ve phased out `connect` for `useSelector`/`useDispatch` — cleaner in modern apps.

---

##  25. <a name='HowdoesReduxThunkhandleasyncflowinproduction'></a>How does Redux Thunk handle async flow in production?

Thunk enables async actions via middleware (async logic via functions as actions).  
```javascript
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const reducer = (state = { data: null }, action) => {
  return action.type === 'FETCHED' ? { data: action.payload } : state;
};
const store = createStore(reducer, applyMiddleware(thunk));

const fetchData = () => async dispatch => {
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();
  dispatch({ type: 'FETCHED', payload: data });
};

store.dispatch(fetchData());
```
- **Insight**: In a real-time app, I used Thunk for API calls—RTK Query later simplified it further.

---

##  26. <a name='HowdoyouconfigureroutingwithReactRouterinascalableway'></a>How do you configure routing with React Router in a scalable way?

React Router v6 offers flexible routing:  
```javascript
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:id" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/user/1')}>Go to User</button>;
}

function User() { return <h1>User Page</h1>; }
```
- **Object Config**: Define routes dynamically in large apps.  
- **Insight**: In a 50-route app, I used nested routes and lazy loading—kept bundle size lean.
- **Insight**: v6’s `<Routes>` is cleaner — used it for a multi-page dashboard.

---

##  27. <a name='HowdoesReactRouterv6handlenavigationandwhatsakeyimprovementoverv5'></a>How does React Router v6 handle navigation, and what’s a key improvement over v5?

React Router v6 uses hooks and a simpler API for navigation:  
```javascript
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/about')}>Go to About</button>;
}
```
- **Improvement**: `<Routes>` replaces `Switch`, supporting relative paths and better nesting; `useNavigate` replaces `history.push`.  
- **Insight**: In a multi-page app, I leveraged v6’s `useParams` and nesting to simplify dynamic routes, cutting route config code by 20% vs. v5.

---

