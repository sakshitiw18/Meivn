"""
SQLite database engine, session management, and base model.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import get_settings

settings = get_settings()

# check_same_thread=False is required for SQLite when used with FastAPI's
# threaded request handling.
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a DB session and closes it afterward."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _run_startup_migrations():
    """
    Non-destructive schema migration for SQLite.
    Checks each model table against the live database schema. Any missing columns
    are added via ALTER TABLE ... ADD COLUMN without touching existing data.
    Missing indexes are also created.
    """
    from sqlalchemy import inspect, text

    with engine.connect() as conn:
        inspector = inspect(conn)
        existing_tables = set(inspector.get_table_names())

        for table_name, table in Base.metadata.tables.items():
            if table_name not in existing_tables:
                continue

            existing_columns = {col["name"] for col in inspector.get_columns(table_name)}

            for column in table.columns:
                if column.name not in existing_columns:
                    col_type = column.type.compile(engine.dialect)
                    default_clause = ""
                    if column.default is not None and column.default.arg is not None:
                        dflt = column.default.arg
                        if not callable(dflt):
                            if isinstance(dflt, bool):
                                default_clause = f" DEFAULT {1 if dflt else 0}"
                            elif isinstance(dflt, (int, float)):
                                default_clause = f" DEFAULT {dflt}"
                            else:
                                default_clause = f" DEFAULT '{dflt}'"

                    alter_stmt = f"ALTER TABLE {table_name} ADD COLUMN {column.name} {col_type}{default_clause}"
                    conn.execute(text(alter_stmt))
                    conn.commit()

            # Ensure model indexes exist
            existing_indexes = {idx["name"] for idx in inspector.get_indexes(table_name) if idx.get("name")}
            for index in table.indexes:
                if index.name and index.name not in existing_indexes:
                    index.create(conn)
                    conn.commit()


def init_db():
    """Create all tables and apply non-destructive migrations. Call once at startup."""
    from app import models  # noqa: F401  (ensures models are registered)
    Base.metadata.create_all(bind=engine)
    _run_startup_migrations()
