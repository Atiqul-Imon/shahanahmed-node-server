import Snippet from "../models/snippet.model.js";

export async function CreateSnippetController(req, res){
try {
    const newSnippet = new Snippet(req.body);

    await newSnippet.save();
    res.status(201).json(newSnippet); 
} catch (error) {
res.status(500).josn({
    error: error.message
})    
}
}


export async function getAllSnippet(req, res){
    try {
        const snippets = await Snippet.find().sort({
             createdAt: -1
        });

res.json(snippets);


    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


export async function updateSnippetController(req, res) {
  try {
    const snippet = await Snippet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }

    res.json(snippet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteSnippetController(req, res) {
  try {
    const snippet = await Snippet.findByIdAndDelete(req.params.id);
    
    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }

    res.json({ message: 'Snippet deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}