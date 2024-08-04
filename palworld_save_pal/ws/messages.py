from enum import Enum
from typing import Any, Dict, List
from pydantic import BaseModel
from uuid import UUID

from palworld_save_pal.pals.pal import Pal


class BaseMessage(BaseModel):
    type: str
    data: None = None


class MessageType(str, Enum):
    GET_PLAYERS = "get_players"
    GET_PAL_DETAILS = "get_pal_details"
    DOWNLOAD_SAVE_FILE = "download_save_file"
    LOAD_SAVE_FILE = "load_save_file"
    UPDATE_SAVE_FILE = "update_save_file"
    SYNC_APP_STATE = "sync_app_state"
    PROGRESS_MESSAGE = "progress_message"
    ERROR = "error"


class DownloadSaveFileMessage(BaseMessage):
    type: str = MessageType.DOWNLOAD_SAVE_FILE.value


class LoadSaveFileMessage(BaseMessage):
    type: str = MessageType.LOAD_SAVE_FILE.value
    data: List[int]


class UpdateSaveFileMessage(BaseMessage):
    type: str = MessageType.UPDATE_SAVE_FILE.value
    data: Dict[UUID, Pal]


class GetPalDetailsMessage(BaseMessage):
    type: str = MessageType.GET_PAL_DETAILS.value
    data: UUID


class SyncAppStateMessage(BaseMessage):
    type: str = MessageType.SYNC_APP_STATE.value
    data: None = None


class ProgressMessage(BaseMessage):
    type: str = MessageType.PROGRESS_MESSAGE.value
    data: str
