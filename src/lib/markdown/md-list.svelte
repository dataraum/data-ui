<script lang="ts">
	import { Marked } from 'marked';
	import { onMount } from 'svelte';
    const marked = new Marked({
        async: false,
        pedantic: false,
        gfm: true,
        breaks: true
    });

    const { markdown, showHelpText } = $props();

	const block =
		'# Select a data source\n\n' +
        'To get started, select a data source from the left sidebar. You can choose from various data sources such as CSV files, databases, or APIs. Once you select a data source, the system will automatically generate a report based on the data available in that source.\n\n' +
        '## Data Source Selection\n\n' +
        '1. Click on the **Data Sources** tab in the left sidebar.\n' +
        '2. Browse through the list of available data sources.\n' +
        '3. Click on a data source to select it.\n\n' +
        '## Report Generation\n\n' +
        'Once you have selected a data source, the system will automatically generate a report based on the data available in that source. The report will include various insights and analyses based on the data, such as:\n\n' +
        '- Data quality assessment\n' +
        '- Data completeness analysis\n' +
        '- Data consistency checks\n' +
        '- Data profiling results\n\n' +
        'You can view the generated report in the main content area. The report will be updated automatically whenever you select a different data source or when the data in the selected source changes.\n\n' +
        '## Next Steps\n\n' +
        'After selecting a data source and generating a report, you can take the following actions:\n\n' +
        '- **Review the report**: Check the insights and analyses provided in the report to understand the quality and characteristics of your data.\n' +
        '- **Download the report**: If you want to keep a copy of the report, you can download it in various formats such as PDF or CSV.\n' +
        '- **Share the report**: You can share the report with your team members or stakeholders by exporting it to a shared location or sending it via email.\n\n' +
        'By following these steps, you can effectively utilize the data source selection and report generation features of the system to gain valuable insights from your data.\n\n' +
        '## Additional Features\n\n' +
        'The system also provides additional features to enhance your data analysis experience:\n\n' +
        '- **Data Visualization**: You can visualize your data using various charts and graphs to better understand trends and patterns.\n' +
        '- **Data Transformation**: Apply transformations to your data to clean, filter, or aggregate it before generating reports.\n' +
        '- **Collaboration**: Share your reports and collaborate with team members in real-time to make data-driven decisions together.\n\n' +
        'These features will help you make the most out of your data and improve your overall data analysis workflow.\n\n' +
        '## Conclusion\n\n' +
        'By selecting a data source and generating reports, you can gain valuable insights into your data and make informed decisions based on the analysis provided. The system is designed to be user-friendly and intuitive, allowing you to easily navigate through the available data sources and generate reports with just a few clicks.\n\n' +
        'If you have any questions or need assistance, feel free to reach out to our support team or refer to the documentation for more detailed instructions on using the system\'s features.';   

	let blockHtml = $state('');
    onMount(() => {
        showHelpText.subscribe((value: boolean) => {
            if (value) {
                blockHtml = marked.parse(block) as string;
            } else {
                blockHtml = '';
            }
        });
        markdown.subscribe((value: string) => {
            if (value) {
                blockHtml = marked.parse(value) as string;
            }
        });
    });
</script>

<div class="prose w-full max-w-none">
	{@html blockHtml}
</div>
