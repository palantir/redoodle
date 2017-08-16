# Redoodle FAQ

## Table of Contents

- [Is Redoodle a replacement for Redux? Do I need both?](#replacement)


<a id="replacement"></a>
### Is Redoodle a replacement for Redux? Do I need both?

Redoodle was **not** designed to be a replacement for the Redux library:
Redux-powered applications can start integrating any of Redoodle's addons
piecewise without gutting all of their existing Actions, Reducers, or Store wiring.
It is fully encouraged that consumers continue to use Redux for store management,
along with the many other fantastic community extensions for Redux as listed
on [awesome-redux](https://github.com/xgrommx/awesome-redux).

However, after writing Redoodle the only thing missing to be a
drop-in replacement for Redux was the `createStore()` function,
so we added it to Redoodle in 2.1.
