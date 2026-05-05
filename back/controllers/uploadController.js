const supabase = require('../config/storage');

async function uploadProduto(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });

    const { produto_id } = req.params;
    const ext = req.file.mimetype.split('/')[1];
    const path = `${req.usuarioId}/${produto_id}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('produtos')
      .upload(path, req.file.buffer, { contentType: req.file.mimetype });

    if (error) return res.status(500).json({ error: error.message });

    const { data } = supabase.storage.from('produtos').getPublicUrl(path);

    return res.json({ url: data.publicUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function uploadVendedorPerfil(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });

    const ext = req.file.mimetype.split('/')[1];
    const path = `${req.usuarioId}/perfil.${ext}`;

    const { error } = await supabase.storage
      .from('vendedores')
      .upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

    if (error) return res.status(500).json({ error: error.message });

    const { data } = supabase.storage.from('vendedores').getPublicUrl(path);

    return res.json({ url: data.publicUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function uploadVendedorBanner(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });

    const ext = req.file.mimetype.split('/')[1];
    const path = `${req.usuarioId}/banner.${ext}`;

    const { error } = await supabase.storage
      .from('vendedores')
      .upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

    if (error) return res.status(500).json({ error: error.message });

    const { data } = supabase.storage.from('vendedores').getPublicUrl(path);

    return res.json({ url: data.publicUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function uploadMarca(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });

    const { marca_id } = req.params;
    const ext = req.file.mimetype.split('/')[1];
    const path = `${marca_id}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('marcas')
      .upload(path, req.file.buffer, { contentType: req.file.mimetype });

    if (error) return res.status(500).json({ error: error.message });

    const { data } = supabase.storage.from('marcas').getPublicUrl(path);

    return res.json({ url: data.publicUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function uploadEvento(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });

    const { evento_id } = req.params;
    const ext = req.file.mimetype.split('/')[1];
    const path = `${evento_id}/banner.${ext}`;

    const { error } = await supabase.storage
      .from('eventos')
      .upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

    if (error) return res.status(500).json({ error: error.message });

    const { data } = supabase.storage.from('eventos').getPublicUrl(path);

    return res.json({ url: data.publicUrl });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { uploadProduto, uploadVendedorPerfil, uploadVendedorBanner, uploadMarca, uploadEvento };