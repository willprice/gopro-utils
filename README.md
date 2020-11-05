# GoPro Utils

## Install

```bash
$ sudo npm install gopro-utils -g
```

## Usage

```
$ gpmd-extract GX000123.MP4 GX000123.JSON
```

The JSON file's contents corresponds to the output of the
[`gopro-telemetry`](https://github.com/JuanIrache/gopro-telemetry)
library, see [here](https://github.com/JuanIrache/gopro-telemetry#output) for
more details.

## Acknowledgements

This CLI app is a *very* thin wrapper around [Juan Irache's](https://github.com/JuanIrache) 
great GoPro libraries
([`gpmf-extract`](https://github.com/JuanIrache/gpmf-extract),
[`gopro-telemtry`](https://github.com/JuanIrache/gopro-telemetry)),
he is the one deserving of all the praise!
