import path from "node:path";
import { Project, QuoteKind, SyntaxKind } from "ts-morph";

export async function addManifestToSeedgridConfig(params: {
  appRoot: string;
  importName: string;
  importFrom: string;
  manifestVar: string;
}) {
  const filePath = path.join(params.appRoot, "seedgrid.config.ts");

  const project = new Project({
    manipulationSettings: { quoteKind: QuoteKind.Double },
    skipAddingFilesFromTsConfig: true
  });

  const sf = project.addSourceFileAtPath(filePath);

  const existingImport = sf.getImportDeclarations().find((i) => i.getModuleSpecifierValue() === params.importFrom);
  if (existingImport) {
    const named = existingImport.getNamedImports().map((n) => n.getName());
    if (!named.includes(params.importName)) existingImport.addNamedImport(params.importName);
  } else {
    sf.addImportDeclaration({
      moduleSpecifier: params.importFrom,
      namedImports: [params.importName]
    });
  }

  const varDecl = sf.getVariableDeclaration("seedgridConfig");
  if (!varDecl) throw new Error("seedgrid.config.ts: nao encontrei 'seedgridConfig'");

  const initializer = varDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);
  const modulesProp = initializer.getProperty("modules");

  if (!modulesProp || modulesProp.getKind() !== SyntaxKind.PropertyAssignment) {
    throw new Error("seedgrid.config.ts: nao encontrei 'modules: [...]'");
  }

  const arr = (modulesProp as any).getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);
  const elements = arr.getElements().map((e: { getText: () => string }) => e.getText());

  if (!elements.includes(params.manifestVar)) {
    arr.addElement(params.manifestVar);
  }

  await sf.save();
}
