# Tony's Casino

Tony's Casino is a betting game for FRC match results. Users earn virtual tokens depending on their accuracy in their betting.

## Basic Information

Property  | Description
----------|------------
Platform  | Windows (+ possibly other desktop platforms)
Language  | HTML + CSS + JavaScript
Framework | [Electron](https://electronjs.org/)

## Data Storage

Tony's Casino uses the browser's (Electron's) localStorage for data storage. Data is stored as JSON objects in the localStorage items, which represent the "tables".

The following sections document the JSON objects:

### Users

**Parameters:**

* `user-id`: A unique id for each user. Used for betting.
* `password`: The user's password. Stored encrypted with SHA256.

**Example Object:**

```JSON
[
    {
        "user-id": 1234,
        "password": "37950476A9D9FA2F03AE81F40EE58FDF6FB42C88DBAFF3561BA8C57D98D3F905"
    },
    {
        "user-id": 5212,
        "password": "B94D27B9934D3E08A52E52D7DA7DABFAC484EFE37A5380EE9088F7ACE2EFCDE9"
    }
]
```

### Matches

**Parameters:**

* `match-id`: A unique id for each match. Used for match updating and betting.
* `b1`, `b2`, `r1`, `...`: The team numbers for all match competitors. `-1` when not set.
* `winner`: The winning alliance for the match. Can be `b` for blue alliance, `r` for red alliance, or `u` for unknown.

**Example Object:**

```JSON
[
    {
        "match-id": "Durham-Q-12",
        "b1": 1234, "b2": 2345, "b3": 3456,
        "r1": 4567, "r2": 5678, "r3": 6789,
        "winner": "r"
    },
    {
        "match-id": "NorthBay-P-4",
        "b1": -1, "b2": -1, "b3": -1,
        "r1": -1, "r2": -1, "r3": -1,
        "winner": "u"
    }
]
```

### Bets

**Parameters:**

* `user-id`: The better's id.
* `match-id`: The betting match's id.
* `betting-alliance`: The better's choice of alliance. Can be `b` for blue alliance, or `r` for red alliance.

**Example Object:**

```JSON
[
    {
        "user-id": 1234,
        "match-id": "Durham-Q-12",
        "betting-alliance": "b"
    },
    {
        "user-id": 5212,
        "match-id": "NorthBay-P-4",
        "betting-alliance": "r"
    }
]
```
