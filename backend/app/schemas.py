from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models import ReportStatus


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class UserCreate(BaseModel):
    email: str
    password: str  


class UserRead(ORMModel):
    id: int
    email: str
    created_at: datetime  


class RuleBase(BaseModel):
    name: str

    margin_left: float = 3
    margin_right: float = 1.5
    margin_top: float = 2
    margin_bottom: float = 2

    font_name: str = "Times New Roman"
    font_size: int = 12
    line_spacing: float = 1.5
    first_line_indent: float = 1.25

    heading_font_name: str = "Times New Roman"
    heading_font_size: int = 12


class RuleCreate(RuleBase):
    pass


class RuleRead(RuleBase, ORMModel):
    id: int
    owner_id: int | None


class ReportCreate(BaseModel):
    rule_id: int  
    

class IssueRead(ORMModel):
    id: int
    parameter: str
    expected: str
    actual: str


class ReportRead(ORMModel):
    id: int
    filename: str
    status: ReportStatus
    rule_id: int
    created_at: datetime
    issues: list[IssueRead] = []
