from json import loads


def parse_to_dict(value: str) -> dict:
    s = "```json"
    py_ind = value.index(s)
    value = value[py_ind + len(s) :]

    s = "```"
    quote_ind = value.index(s)
    value = value[:quote_ind]

    return loads(value)
