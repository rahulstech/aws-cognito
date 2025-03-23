if [[ ! -d ".deploy" ]]
then
    mkdir ".deploy"
fi

# create the deploy zip
zip -r ".deploy/deploy.zip" node_modules/ src/ handler.js package.json