"""Spy Poll - content loader. Merges the three content modules (loaded by file path, never relative import).

QUESTIONS = [{"id","text":{en,ko},"pct","family"}]   FINALS = [{"id","prompt":{en,ko},"family","answers":[9 x {"text","pct"}]}]
"""
import importlib.util
from pathlib import Path


def _load(name):
    spec = importlib.util.spec_from_file_location("spy_poll_" + name, Path(__file__).with_name(name + ".py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


QUESTIONS = list(_load("questions_1").QUESTIONS) + list(_load("questions_2").QUESTIONS)
FINALS = list(_load("finals").FINALS)
