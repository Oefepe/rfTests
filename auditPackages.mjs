import fs from 'fs';
import { exec } from 'child_process';

const REPORTS_FOLDER = 'reports';
const AUDITED_PACKAGES_FILE = 'auditedPackages.json';
const URGENT_SEVERITIES = ['high', 'critical'];
const FAILED = 'FAILED';
const PASSED = 'PASSED';

((title = process.argv[2]) => {
  exec('npm audit --json', (error, packages) => {
    const auditedPackages = Object.entries(JSON.parse(packages).vulnerabilities)
      .filter((packageInfo) => packageInfo[1].isDirect)
      .map((packageInfo) => packageInfo[1]);

    const auditStatus = auditedPackages
      .map((packageInfo) => packageInfo.severity)
      .some((severity) => URGENT_SEVERITIES.includes(severity))
      ? FAILED
      : PASSED;

    const bodyData = {
      title: `${title} Vulnerabilities (fail if high or critical severity)`,
      details: 'Details of Audited Packages',
      report_type: 'SECURITY',
      result: auditStatus,
      data: auditedPackages.map((auditedPackage) => ({
        type: 'TEXT',
        title: `${auditedPackage.name},`,
        value: `status: ${auditedPackage.severity}`,
      })),
    };

    if (fs.existsSync(REPORTS_FOLDER)) {
      fs.rmSync(REPORTS_FOLDER, { recursive: true, force: true });
    }

    fs.mkdirSync(REPORTS_FOLDER);

    fs.writeFile(
      `${REPORTS_FOLDER}/${AUDITED_PACKAGES_FILE}`,
      JSON.stringify(bodyData, null, 2),
      (error) => {
        if (error) return;
      }
    );
  });
})();
