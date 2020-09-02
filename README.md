# Monorepo package.json inheritance

## The problem

In a monorepo, most of the time you would want to have your packages have their own package.json. Most of these
repos have a central build script that help build, test, and bundle those packages. Further, these central build
scripts usually are themselves packages. The issue here is that if you placed the devDependencies inside a central
build package, all those build tools (and their dependencies) are "phantom dependencies". Generally you have to
update the configurations of each build tools to accommodate the node resolutions (e.g. webpack loaders, plugins).

## The solution

To support a better workflow, we introduce the idea of package "inheritance". It is by no means true inheritance, 
but it helps repo admins to centrally manage a set of devDependencies, dependencies in a central location while
avoiding the issue of phantom dependencies.

The central build script package can provide a set of shared partial package.json files. The monorepo packages
can then declare that they inherit from those package.json partial files. This tool can then be used to make
sure the package.json's actually respect those partial files.

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
