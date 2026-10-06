import enum
from datetime import datetime

from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class ReportStatus(str, enum.Enum):
    UPLOADED = "uploaded"
    CHECKED = "checked"
    FIXED = "fixed"
    FAILED = "failed"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    password_hash: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    reports: Mapped[list["Report"]] = relationship(back_populates="owner")
    rules: Mapped[list["Rule"]] = relationship(back_populates="owner")


class Rule(Base):
    __tablename__ = "rules"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str]

    margin_left: Mapped[float] = mapped_column(default=30)
    margin_right: Mapped[float] = mapped_column(default=10)
    margin_top: Mapped[float] = mapped_column(default=20)
    margin_bottom: Mapped[float] = mapped_column(default=20)

    font_name: Mapped[str] = mapped_column(default="Times New Roman")
    font_size: Mapped[int] = mapped_column(default=14)
    line_spacing: Mapped[float] = mapped_column(default=1.5)
    first_line_indent: Mapped[float] = mapped_column(default=12.5)  # mm

    heading_font_name: Mapped[str] = mapped_column(default="Times New Roman")
    heading_font_size: Mapped[int] = mapped_column(default=14)

    owner: Mapped["User | None"] = relationship(back_populates="rules")


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    rule_id: Mapped[int] = mapped_column(ForeignKey("rules.id"))
    filename: Mapped[str]
    status: Mapped[ReportStatus] = mapped_column(default=ReportStatus.UPLOADED)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    owner: Mapped["User"] = relationship(back_populates="reports")
    rule: Mapped["Rule"] = relationship()
    issues: Mapped[list["Issue"]] = relationship(
        back_populates="report", cascade="all, delete-orphan"
    )


class Issue(Base):
    __tablename__ = "issues"

    id: Mapped[int] = mapped_column(primary_key=True)
    report_id: Mapped[int] = mapped_column(ForeignKey("reports.id"))
    parameter: Mapped[str]  
    expected: Mapped[str]
    actual: Mapped[str]

    report: Mapped["Report"] = relationship(back_populates="issues")
