import graphviz

def create_workflow_diagram(nodes, edges, filename, graph_label):
    dot = graphviz.Digraph(comment=graph_label)
    dot.attr(rankdir='TB', label=graph_label, fontsize='20')
    dot.attr('node', shape='box', style='rounded', fontname='Helvetica', fontsize='12')
    dot.attr('edge', fontname='Helvetica', fontsize='10')

    for node_id, node_label in nodes.items():
        dot.node(node_id, node_label)

    for edge_start, edge_end in edges:
        dot.edge(edge_start, edge_end)

    try:
        dot.render(filename, format='png', cleanup=True, view=False)
        print(f"Diagram saved to {filename}.png")
    except Exception as e:
        print(f"Error rendering diagram {filename}: {e}")

# Procore Estimation Workflow
procore_est_nodes = {
    'A': 'Project Setup',
    'B': 'Import Plans/Models',
    'C': 'Perform Takeoff\n(Native or Integrated)',
    'D': 'Access Cost Database',
    'E': 'Create Estimate Line Items',
    'F': 'Apply Markups',
    'G': 'Generate Estimate Report'
}
procore_est_edges = [('A', 'B'), ('B', 'C'), ('C', 'E'), ('D', 'E'), ('E', 'F'), ('F', 'G')]
create_workflow_diagram(procore_est_nodes, procore_est_edges, '/home/ubuntu/ux_research/procore_estimation_workflow', 'Procore Estimation Workflow')

# Procore Scheduling Workflow
procore_sch_nodes = {
    'A': 'Project Setup',
    'B': 'Import/Create\nSchedule Tasks',
    'C': 'Define Durations\n& Dependencies',
    'D': 'Assign Resources',
    'E': 'Track Progress',
    'F': 'Update Schedule',
    'G': 'Generate Schedule Report'
}
procore_sch_edges = [('A', 'B'), ('B', 'C'), ('C', 'D'), ('D', 'E'), ('E', 'F'), ('F', 'G')]
create_workflow_diagram(procore_sch_nodes, procore_sch_edges, '/home/ubuntu/ux_research/procore_scheduling_workflow', 'Procore Scheduling Workflow')

# Buildertrend Estimation Workflow
bt_est_nodes = {
    'A': 'Project Setup',
    'B': 'Upload Plans (Takeoff)',
    'C': 'Perform 2D Takeoff',
    'D': 'Create Estimate',
    'E': 'Use Cost Catalog',
    'F': 'Add Line Items',
    'G': 'Generate Proposal'
}
bt_est_edges = [('A', 'B'), ('B', 'C'), ('C', 'D'), ('E', 'F'), ('D', 'F'), ('F', 'G')]
create_workflow_diagram(bt_est_nodes, bt_est_edges, '/home/ubuntu/ux_research/buildertrend_estimation_workflow', 'Buildertrend Estimation Workflow')

# Buildertrend Scheduling Workflow
bt_sch_nodes = {
    'A': 'Project Setup',
    'B': 'Create Schedule Tasks',
    'C': 'Set Durations\n& Predecessors',
    'D': 'Assign To-Dos/Subs',
    'E': 'Link to Calendar',
    'F': 'Track Progress\n(Daily Logs)',
    'G': 'Communicate Updates\n(Client Portal)'
}
bt_sch_edges = [('A', 'B'), ('B', 'C'), ('C', 'D'), ('D', 'E'), ('D', 'F'), ('F', 'G')]
create_workflow_diagram(bt_sch_nodes, bt_sch_edges, '/home/ubuntu/ux_research/buildertrend_scheduling_workflow', 'Buildertrend Scheduling Workflow')

# ACC Estimation/Takeoff Workflow
acc_est_nodes = {
    'A': 'Project Setup (Docs)',
    'B': 'Upload Plans/Models\n(Docs)',
    'C': 'Open in Takeoff Module',
    'D': 'Perform 2D/3D Takeoff',
    'E': 'Classify Items',
    'F': 'Generate Quantities',
    'G': 'Link to Cost Management\n(Build)'
}
acc_est_edges = [('A', 'B'), ('B', 'C'), ('C', 'D'), ('D', 'E'), ('E', 'F'), ('F', 'G')]
create_workflow_diagram(acc_est_nodes, acc_est_edges, '/home/ubuntu/ux_research/acc_estimation_workflow', 'ACC Estimation/Takeoff Workflow')

# ACC Scheduling Workflow
acc_sch_nodes = {
    'A': 'Project Setup (Build)',
    'B': 'Import/Create Schedule',
    'C': 'View/Manage Tasks\n(Gantt/List)',
    'D': 'Link Tasks to\nIssues/Docs',
    'E': 'Track Progress',
    'F': 'Generate Schedule Report'
}
acc_sch_edges = [('A', 'B'), ('B', 'C'), ('C', 'D'), ('D', 'E'), ('E', 'F')]
create_workflow_diagram(acc_sch_nodes, acc_sch_edges, '/home/ubuntu/ux_research/acc_scheduling_workflow', 'ACC Scheduling Workflow')


