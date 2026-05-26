## local skills

When the user says to use a skill, check this local skills directory first:

./agent/skills

Open the mentioned skill's `SKILL.md` file from that directory before acting.

- read the powerful-model-brain.skill for complex task and plan.
- when creating a plan also mention which skill we will use to execute the provided task and why.
- understand each task before creating a plan or executing task

# readme data update

- Update the readme file after each phase completion; add all the details of new features and chages regarding sections so user can stay up to date with features which is new added in or updated in project

# Graphify Integration

- Use the `/graphify` skill to map any project.
- Always check for `graphify-out/GRAPH_REPORT.md` and `graphify-out/graph.json` before answering architecture questions.
- Use the `graphify` MCP server tools (query_graph, get_node, etc.) for autonomous navigation of the codebase graph.
