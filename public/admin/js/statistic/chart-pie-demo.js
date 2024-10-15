// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// Pie Chart Example
var ctx = document.getElementById("myPieChart");
var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ["chả lụa có tiêu", "chả lụa không tiêu", "chả gân có tiêu", "chả gân không tiêu", "Nem chua", "Patê", "Khác"],
    datasets: [{
      data: revenueDataByProduct,
      backgroundColor: ['#4e73df', '#8aaae8', '#1cc88a', '#77deb9', '#f7d711', 'orange', '#E74A3B'],
      hoverBackgroundColor: ['#4e73df', '#8aaae8', '#1cc88a', '#77deb9', '#f7d711', 'orange', '#E74A3B'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
    },
    legend: {
      display: false
    },
    cutoutPercentage: 80,
  },
});