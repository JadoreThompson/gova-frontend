from pydantic import BaseModel, Field
from openapi_pydantic import OpenAPI
from openapi_pydantic.util import PydanticSchema, construct_open_api_with_schema_class
from engine.base_action import BaseAction


def construct_base_open_api() -> OpenAPI:
    # For Pydantic 1.x, use `parse_obj` instead of `model_validate`
    return OpenAPI.model_validate(
        {
            "info": {"title": "My own API", "version": "v0.0.1"},
            "paths": {
                "/ping": {
                    "post": {
                        "requestBody": {
                            "content": {
                                "application/json": {
                                    "schema": PydanticSchema(schema_class=BaseAction)
                                }
                            }
                        },
                        "responses": {
                            "200": {
                                "description": "pong",
                                "content": {
                                    "application/json": {
                                        "schema": PydanticSchema(
                                            schema_class=PingResponse
                                        )
                                    }
                                },
                            }
                        },
                    }
                }
            },
        }
    )


class PingRequest(BaseModel):
    """Ping Request"""

    req_foo: str = Field(description="foo value of the request")
    req_bar: str = Field(description="bar value of the request")


class PingResponse(BaseModel):
    """Ping response"""

    resp_foo: str = Field(description="foo value of the response")
    resp_bar: str = Field(description="bar value of the response")


open_api = construct_base_open_api()
open_api = construct_open_api_with_schema_class(open_api)

# print the result openapi.json
# For Pydantic 1.x, use `json` instead of `model_dump_json`
print(open_api.model_dump_json(by_alias=True, exclude_none=True, indent=2))
